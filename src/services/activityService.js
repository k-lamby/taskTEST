//================== activityService.js ==========================//
// This service handles adding and fetching user activities from Firestore.
// Activities include logs such as project updates, task completions,
// file uploads, or other user-initiated actions.
//===============================================================//

import { db } from "../config/firebaseConfig"; // Ensure Firebase is correctly configured
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

// ===========================================================//
// This gets all recent activities for the projectData that is passed to it
// accepts null, otherwise returns to the top n most recent activities
//============================================================//
export const fetchRecentActivities = async (projectData, maxActivities = null) => {
  try {
    // get to make sure the user id is passed
    if (!userId) throw new Error("User ID is required to fetch activities.");

    // use fetch projects from the project service to get an array of project ids
    print(userId)
    const projectIds = projectData.map((project) => project.id);

    if (projectIds.length === 0) {
      return [];
    }

    // we then collect the datafrom firestore.
    // firestore has a limit of 10 items
    // we should consider how best to handle this for scalability
    let allActivities = [];
    const batchSize = 10;
    for (let i = 0; i < projectIds.length; i += batchSize) {
      const projectBatch = projectIds.slice(i, i + batchSize);

      // then get activities for that query
      // limit it to the top 10
      const activitiesQuery = query(
        collection(db, "activities"),
        where("projectId", "in", projectBatch),
        orderBy("timestamp", "desc"),
        limit(maxActivities)
      );
      // apply a limit to the response if  max limit is provided
      if (maxActivities) {
        activitiesQuery = query(activitiesQuery, limit(maxActivities));
      }

      // build the object for return
      const snapshot = await getDocs(activitiesQuery);
      const batchActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allActivities.push(...batchActivities);
    }

    // then sort by timestamp
    allActivities.sort((a, b) => b.timestamp - a.timestamp);

    // return the activities up to the max activities requested
    return maxActivities ? allActivities.slice(0, maxActivities) : allActivities;

  } catch (error) {
    throw error;
  }
};

/**
 * Add a new activity log to Firestore.
 * 
 * @param {string} projectId - The project ID.
 * @param {string} taskId - The task ID.
 * @param {string} userId - The user performing the activity.
 * @param {Object} activityData - Details of the activity (e.g., message).
 * @returns {Promise<string>} - The document ID of the added activity.
 */
export const addActivity = async (projectId, taskId, userId, activityData) => {
  try {
    if (!projectId || !taskId || !userId) {
      throw new Error("Project ID, Task ID, and User ID are required.");
    }


    // Store activities in a top-level "activities" collection
    const activityRef = collection(db, "activities");

    // Add the activity with relevant metadata
    const docRef = await addDoc(activityRef, {
      projectId,
      taskId,
      userId,
      ...activityData,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding activity:", error);
    throw error;
  }
};