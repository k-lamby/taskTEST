//================== taskService.js ===========================//
// This service handles CRUD operations for tasks in Firestore.
// It handles various task specific functions for the application
//============================================================//

import { db } from "../config/firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// NOT CURRENTLY IN USE
export const createTaskWithSubtasks = async (
  projectId,
  taskName,
  dueDate,
  ownerId,
  subtasks = [],
  attachments = [],
  messages = []
) => {
  try {
    
    const formattedSubtasks = subtasks.map((subtask, index) => ({
      id: `subtask${index + 1}`,
      name: subtask.name,
      owner: subtask.owner || ownerId,
      priority: subtask.priority || "Medium",
      dueDate: new Date(subtask.dueDate || dueDate),
      completionDate: null,
      completed: false,
      attachments: subtask.attachments || [],
      messages: subtask.messages || [],
    }));

    
    const taskRef = await addDoc(collection(db, "tasks"), {
      name: taskName,
      projectId,
      owner: ownerId,
      dueDate: new Date(dueDate),
      createdAt: serverTimestamp(),
      subtasks: formattedSubtasks,
      attachments,
      messages,
    });

    return taskRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// gets all the tasks associated with a particular project id
export const fetchTasksByProjectId = async (projectId) => {
  try {
    // construct the query for getting the data from the database
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("projectId", "==", projectId));

    // then query the database to get the associated docs
    const querySnapshot = await getDocs(tasksQuery);

    // this array will store our formatted tasks
    const tasksForProject = [];

    // we then iterate over each document in the returned result
    // append the formatted object to the tasks project.
    querySnapshot.forEach((doc) => {
      // extract task data from Firestore document
      const data = doc.data();

      let dueDate = null;
      let createdAt = null;

      // convert the firestore timestamps into javascript date functions
      if (data.dueDate && typeof data.dueDate.toDate === "function") {
        dueDate = data.dueDate.toDate();
      }
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        createdAt = data.createdAt.toDate();
      }

      // build the task object
      const taskObject = {
        id: doc.id, // grab the task id
        ...data,    // get the task data, keep the object the same
        dueDate,
        createdAt, 
      };

      // append the task object to the task array
      tasksForProject.push(taskObject);
    });

    // return the complete array
    return tasksForProject;
  } catch (error) {
    console.error("Error fetching tasks by projectId:", error);
    throw error;
  }
};

// get all the tasks associated with a particular user
export const fetchTasksWithSubtasksByOwner = async (ownerId) => {
  try {
    // build the query for getting the tasks
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("owner", "==", ownerId));

    // query the database and wait for the response
    const querySnapshot = await getDocs(tasksQuery);

    // initialize an empty array to store the formatted tasks
    const tasksForOwner = [];

    // loop over each doc in the query response to build the object
    querySnapshot.forEach((doc) => {

      const data = doc.data();
      let dueDate = null;
      let createdAt = null;

      // we then need to convert the firestore dates into a js date format
      if (data.dueDate && typeof data.dueDate.toDate === "function") {
        dueDate = data.dueDate.toDate();
      }
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        createdAt = data.createdAt.toDate();
      }

      // Construct the formatted task object
      const taskObject = {
        id: doc.id, // tag with the doc id
        ...data,    // pass all the document data
        dueDate,
        createdAt,
      };

      // then append to the tasks for owner array
      tasksForOwner.push(taskObject);
    });

    // Return the array of formatted tasks
    return tasksForOwner;
  } catch (error) {
    console.error("Error fetching tasks by owner:", error);
    throw error;
  }
};

/* ======================
   Fetch tasks for projects that the user is assigned to
   ====================== */
export const fetchTasksForAssignedProjects = async (userId, maxTasks = 3) => {


  try {
    const tasksRef = collection(db, "tasks");

    // Query tasks where the user is assigned
    const tasksQuery = query(
      tasksRef,
      where("assignedUsers", "array-contains", userId), // Ensure "assignedUsers" field exists in Firestore
      orderBy("createdAt", "desc"),
      limit(maxTasks)
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null,
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    return [];
  }
};

/* ======================
   Mark a subtask as completed
   ====================== */
export const markSubtaskComplete = async (taskId, subtaskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    const updatedSubtasks = taskData.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: true, completionDate: serverTimestamp() }
        : subtask
    );

    await updateDoc(taskRef, { subtasks: updatedSubtasks });
  } catch (error) {
    console.error("Error marking subtask complete:", error);
    throw error;
  }
};

/* ======================
   Add an attachment to a task or subtask
   ====================== */
export const addAttachment = async (taskId, subtaskId = null, attachment) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    if (subtaskId) {
      const updatedSubtasks = taskData.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, attachments: [...subtask.attachments, attachment] }
          : subtask
      );
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } else {
      await updateDoc(taskRef, {
        attachments: [...taskData.attachments, attachment],
      });
    }
  } catch (error) {
    console.error("Error adding attachment:", error);
    throw error;
  }
};

/* ======================
   Add a message to a task or subtask
   ====================== */
export const addMessage = async (taskId, subtaskId = null, message) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    if (subtaskId) {
      const updatedSubtasks = taskData.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, messages: [...subtask.messages, message] }
          : subtask
      );
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
    } else {
      await updateDoc(taskRef, {
        messages: [...taskData.messages, message],
      });
    }
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};