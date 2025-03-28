//================== activityService.js ==========================//
// Handles user activity logs (file uploads, messages, task changes)
//===============================================================//

import { db } from "../config/firebaseConfig";
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export const fetchActivitiesForTasks = async (taskIds) => {
  try {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return [];
    }

    const allActivities = [];
    const batchSize = 10;

    // 🔁 Process in batches of 10 to comply with Firestore's 'in' clause limit
    for (let i = 0; i < taskIds.length; i += batchSize) {
      const batch = taskIds.slice(i, i + batchSize);

      const activitiesQuery = query(
        collection(db, "activities"),
        where("taskId", "in", batch),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(activitiesQuery);

      const batchActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allActivities.push(...batchActivities);
    }

    // 🧹 Sort all combined results by timestamp (most recent first)
    return allActivities.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );
  } catch (error) {
    console.error("❌ Error fetching activities for tasks:", error);
    throw error;
  }
};

export const fetchRecentActivities = async (projectIds, maxActivities = null) => {
  try {
    // if there are no projects then there are no activities, so return an empty array
    if (projectIds.length === 0) return [];

    // firestore has batch size limites, so we will do these in chunks of 10
    const allActivities = [];
    const batchSize = 10; 

    // loop over each batch
    for (let i = 0; i < projectIds.length; i += batchSize) {
      const projectBatch = projectIds.slice(i, i + batchSize);
      // query the database to get those activities for the project
      const activitiesQuery = query(
        collection(db, "activities"),
        where("projectId", "in", projectBatch),
        orderBy("timestamp", "desc"),
        ...(maxActivities ? [limit(maxActivities)] : [])
      );

      const snapshot = await getDocs(activitiesQuery);
      // then map them to the right structure
      const batchActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // and push them onto the activities array
      allActivities.push(...batchActivities);
    }

    // Sort combined results, convert dates to millis for accurate sorting
    return allActivities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
  } catch (error) {
    throw error;
  }
};

export const addActivity = async ({
  projectId,
  taskId,
  userId,
  type,
  content,
  fileUrl = null,
}) => {
  try {
    // check to make sure the required data is present
    if (!projectId || !taskId || !userId) {
      throw new Error("Project ID, Task ID, and User ID are required.");
    }
    // then push the new activity to the database
    const docRef = await addDoc(collection(db, "activities"), {
      projectId,
      taskId,
      userId,
      type,
      content,
      fileUrl,
      timestamp: Timestamp.now(),
    });
    // and return the activity id
    return docRef.id;
  } catch (error) {
    throw error;
  }
};