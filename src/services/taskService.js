//================== taskService.js ===========================//
// This handles CRUD operations related to tasks in firebstore
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

//===========================================================//
// gets all the tasks associated with a particular project id
//===========================================================//
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

//===========================================================//
// used on the summary page, fetches 3 tasks owner by a particular
// user
//===========================================================//
export const fetchTasksForAssignedProjects = async (userId, maxTasks = 3) => {

  try {
    // get the tasks collection
    const tasksRef = collection(db, "tasks");

    //query the tasks collection, getting the owner
    // and then sorting by created date
    const tasksQuery = query(
      tasksRef,
      where("owner", "==", userId),
      orderBy("dueDate", "asc"), //
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
    //if there is an error console log it for now
    console.error("Error fetching assigned tasks:", error);
    return [];
  }
};

//===========================================================//
// toggles the task status between pending and complete
//===========================================================//
export const toggleTaskCompletion = async (taskId, currentStatus) => {
  try {
    // get the id reference to the Firestore task document
    const taskRef = doc(db, "tasks", taskId);

    // determine the new status from the current status
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    // then update the task status
    await updateDoc(taskRef, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    });

  } catch (error) {
    //basic error handling for now
    console.error("Error updating task status:", error);
    throw error;
  }
};

//===========================================================//
//creates a task with subtasks
// subtask logic not yet implemented
//===========================================================//
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
    // reference the task collectiom
    const tasksCollectionRef = collection(db, "tasks");

    // then build the upload from the data passed
    const taskData = {
      projectId: projectId,
      name: taskName,
      dueDate: dueDate,
      owner: ownerId,
      status: "pending",
      createdAt: serverTimestamp(),
      completedAt: null,
      subtasks: subtasks,
      attachments: attachments,
      messages: messages,
    };

    // then add the new document
    const docRef = await addDoc(tasksCollectionRef, taskData);

    // return the new doc id for the task created
    return docRef.id;
  } catch (error) {
    throw error;
  }
};