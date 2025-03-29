import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// 🔔 Send push to all project users except sender
export const sendPushNotificationToProjectUsers = async ({
  projectId,
  senderId,
  title,
  body,
  data = {},
}) => {
  try {
    const usersSnapshot = await getDocs(collection(db, `projects/${projectId}/users`));

    const tokensToNotify = [];

    for (const docSnap of usersSnapshot.docs) {
      const user = docSnap.data();
      const isSelf = user.id === senderId;
      if (!isSelf && user.expoPushToken) {
        tokensToNotify.push(user.expoPushToken);
      }
    }

    // 🚀 Send notification to each token
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
    console.error("❌ Failed to send push notification:", error);
  }
};