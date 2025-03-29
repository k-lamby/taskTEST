//================== notificationService.js =====================//
// used for handling push notifications to other devices
//https://docs.expo.dev/push-notifications/push-notifications-setup/
//===============================================================//
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// this sens a push notification to users on a specific project
export const sendPushNotificationToProjectUsers = async ({
  projectId,
  senderId,
  title,
  body,
  data = {},
}) => {
  try {
    // first get the user group to notify
    const usersSnapshot = await getDocs(collection(db, `projects/${projectId}/users`));

    // then grab the expo tokens for those users
    const tokensToNotify = [];
    for (const docSnap of usersSnapshot.docs) {
      const user = docSnap.data();
      const isSelf = user.id === senderId;
      if (!isSelf && user.expoPushToken) {
        tokensToNotify.push(user.expoPushToken);
      }
    }

    // Send notification to each token
    for (const token of tokensToNotify) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          sound: "default",
          title,
          body,
          data,
        }),
      });
    }
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
};