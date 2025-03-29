import { auth, db } from '../config/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc
} from 'firebase/firestore';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// ========================================
// Utility: Validate password complexity
// ========================================
const validatePasswordComplexity = (password) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar && isLongEnough;
};

// ========================================
// Utility: Register device push token
// ========================================
const registerPushToken = async (userId) => {
  try {
    if (!Device.isDevice) {
      console.warn("⚠️ Push notifications require a physical device.");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn("❌ Push notification permission denied.");
      return;
    }

    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();

    // 🔐 Store expoPushToken in Firestore
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { expoPushToken }, { merge: true });

  } catch (error) {
    console.error("❌ Failed to register push token:", error);
  }
};

// ===============================================
// Sign up new user, store in Auth + Firestore
// ===============================================
export const signUp = async (email, password, firstName, lastName) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (!validatePasswordComplexity(password)) {
      throw new Error('Password does not meet complexity requirements.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email: normalizedEmail,
      createdAt: new Date(),
    });

    await updateSharedProjects(normalizedEmail, user.uid);
    await registerPushToken(user.uid);

    return user;
  } catch (error) {
    console.error("❌ Signup Error:", error.code, error.message);
    throw error;
  }
};

// ===============================================
// Log in user, update push token
// ===============================================
export const logIn = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    await registerPushToken(user.uid);
    return user;
  } catch (error) {
    console.error("❌ Login Error:", error.code, error.message);
    throw error;
  }
};

// ===============================================
// Log out user
// ===============================================
export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("❌ Sign-out Error:", error);
    throw error;
  }
};

// ===============================================
// Update display name (Auth + Firestore)
// ===============================================
export const updateDisplayName = async (newDisplayName) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    await updateProfile(user, { displayName: newDisplayName });

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { displayName: newDisplayName });

    return true;
  } catch (error) {
    console.error("❌ Error updating display name:", error);
    throw error;
  }
};

// ===============================================
// Send password reset email to current user
// ===============================================
export const sendResetPasswordEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No authenticated user or email found.");
    }

    await sendPasswordResetEmail(auth, user.email);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw error;
  }
};

// ===============================================
// Update shared projects: replace email with UID
// ===============================================
export const updateSharedProjects = async (email, userId) => {
  try {
    const projectsRef = collection(db, 'projects');
    const normalizedEmail = email.trim().toLowerCase();

    const q = query(projectsRef, where('sharedWith', 'array-contains', normalizedEmail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      const projectData = docSnapshot.data();
      const updatedSharedWith = projectData.sharedWith.map((entry) =>
        entry === normalizedEmail ? userId : entry
      );

      await updateDoc(doc(db, 'projects', docSnapshot.id), {
        sharedWith: updatedSharedWith,
      });
    });
  } catch (error) {
    console.error("❌ Error updating shared projects:", error);
    throw error;
  }
};

// ===============================================
// Fetch first names by user ID array
// ===============================================
export const fetchUserNamesByIds = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) return {};

    const userChunks = [];
    for (let i = 0; i < userIds.length; i += 30) {
      userChunks.push(userIds.slice(i, i + 30));
    }

    const names = {};
    for (const chunk of userChunks) {
      const q = query(collection(db, 'users'), where('__name__', 'in', chunk));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnapshot) => {
        names[docSnapshot.id] = docSnapshot.data().firstName;
      });
    }

    return names;
  } catch (error) {
    console.error("❌ Error fetching user names:", error);
    return {};
  }
};