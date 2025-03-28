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
import { addActivity } from "./activityService";


export const addTask = async (taskData) => {
  try {
    const {
      name,
      description = "",
      projectId,
      owner,
      dueDate = null,
      status = "pending",
      priority = "medium"
    } = taskData;

    // ✅ Validate required fields
    if (!name || !projectId || !owner) {
      throw new Error("Missing required task fields: name, projectId, or owner.");
    }

    // ✅ Determine completedAt based on status
    const completedAt = status === "completed" ? new Date() : null;

    // ✅ Build Firestore document payload
    const newTask = {
      name,
      description,
      projectId,
      owner,
      status,
      priority,
      createdAt: serverTimestamp(), // Firestore will populate this
      dueDate: dueDate ? dueDate : null,
      completedAt,
    };

    // ✅ Add to Firestore
    const tasksRef = collection(db, "tasks");
    const docRef = await addDoc(tasksRef, newTask);

    // ✅ Log activity (optional, but encouraged)
    await addActivity({
      projectId,
      taskId: docRef.id,
      userId: owner,
      type: "create",
      content:
        status === "completed"
          ? `Added and completed task "${name}".`
          : `Created new task "${name}".`,
    });

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding new task:", error);
    throw error;
  }
};

//===========================================================//
// gets all the tasks associated with a particular project id
//===========================================================//
export const fetchTasksByProjectId = async (projectId) => {
  try {
    // construct the query for getting the data from the database
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(
      tasksRef,
      where("projectId", "==", projectId),
      orderBy("dueDate", "desc")
    );

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
export const fetchTasksForUser = async (userId, maxTasks = null) => {
  try {
    const tasksRef = collection(db, "tasks");

    // Base query: owned by user, ordered by dueDate
    let baseQuery = query(
      tasksRef,
      where("owner", "==", userId),
      orderBy("dueDate", "asc")
    );

    // Conditionally apply a limit if provided
    if (typeof maxTasks === "number" && maxTasks > 0) {
      baseQuery = query(baseQuery, limit(maxTasks));
    }

    const snapshot = await getDocs(baseQuery);

    // Map results
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate?.() || null,
      createdAt: doc.data().createdAt?.toDate?.() || null,
    }));

    // Sort pending tasks first, then by due date
    const sorted = tasks.sort((a, b) => {
      // Bring pending tasks to top
      const statusOrder = (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1);
      if (statusOrder !== 0) return statusOrder;

      // If same status, sort by due date
      const aDue = a.dueDate?.getTime() || 0;
      const bDue = b.dueDate?.getTime() || 0;
      return aDue - bDue;
    });

    return sorted;
  } catch (error) {
    console.error("❌ Error fetching assigned tasks:", error);
    return [];
  }
};

//===========================================================//
// toggles the task status between pending and complete
//===========================================================//
export const toggleTaskCompletion = async (taskId, currentStatus, userId) => {
  try {
    // get the id reference to the Firestore task document
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);
    const taskData = taskSnap.data()

    // determine the new status from the current status
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    // then update the task status
    await updateDoc(taskRef, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    });

    const statusLabel = newStatus === "completed" ? "completed" : "reopened";
    await addActivity({
      projectId: taskData.projectId,
      taskId,
      userId,
      type: "status",
      content: `Marked task "${taskData.name}" as ${statusLabel}.`,
    });

  } catch (error) {
    //basic error handling for now
    console.error("Error updating task status:", error);
    throw error;
  }
};