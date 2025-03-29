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
// we want to send a push notification each time a specific
// activity is logged in the application
import { sendPushNotificationToProjectUsers } from "./notificationService";

// takes an array of task ids and returns the activities for those tasks
export const fetchActivitiesForTasks = async (taskIds) => {
  try {
    // if no tasks are passed, then return an empty array
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return [];
    }
    const allActivities = [];
    const batchSize = 10;
    // firestore has an "in" limit 0f 10
    // so we process in batches to make sure we are within this
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
      // then push all the batches to the final structure
      allActivities.push(...batchActivities);
    }

    // sort all combined results by timestamp (most recent first)
    return allActivities.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );
  } catch (error) {
    throw error;
  }
};
// fetch recent activities, this takes an array of project ids and returns the
// tasks associated with it. If max activities is passed, it will only return
// n number of activities
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

// this handles adding an activity to the the database
export const addActivity = async ({
  projectId,
  taskId,
  userId,
  type,
  content,
  fileUrl = null,
  taskName = "",
}) => {
  try {
    // check to make sure these details are present
    if (!projectId || !taskId || !userId) {
      throw new Error("Project ID, Task ID, and User ID are required.");
    }
    // then add the doc to the database
    const docRef = await addDoc(collection(db, "activities"), {
      projectId,
      taskId,
      userId,
      type,
      content,
      fileUrl,
      timestamp: Timestamp.now(),
    });

    // only trigger push for file, image, or comment
    const shouldNotify = ["file", "image", "message"].includes(type);
    if (shouldNotify) {
      let title = "";
      let body = "";

      //display a message on the push notification to the user summarising the content
      if (type === "message") {
        title = "💬 New Comment";
        body = `${content.slice(0, 40)}${content.length > 40 ? "..." : ""}`;
      } else {
        title = "📎 New File Uploaded";
        body = `${content}`;
      }

      // then wait on the notification being sent
      await sendPushNotificationToProjectUsers({
        projectId,
        senderId: userId,
        title,
        body,
        data: {
          activityType: type,
          taskId,
          taskName,
        },
      });
    }

    return docRef.id;
  } catch (error) {
    throw error;
  }
};