//================== authService.js ==========================//
// handles user based actions and authentication into the app
//===============================================================//
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

// small utility function to handle the password complexity
const validatePasswordComplexity = (password) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar && isLongEnough;
};

// utility for registering a push notification for testflight
const registerPushToken = async (userId) => {
  try {
    if (!Device.isDevice) {
      console.warn("Push notifications require a physical device.");
      return;
    }
    //prompt to get permission from the user
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn("Push notification permission denied.");
      return;
    }
    // get the expo notification
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();

    // then store the expo token in the database
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { expoPushToken }, { merge: true });

  } catch (error) {
    console.error("Failed to register push token:", error);
  }
};

// handles signing up a new user with credentials passed
export const signUp = async (email, password, firstName, lastName) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    // validate the password passed to it
    if (!validatePasswordComplexity(password)) {
      throw new Error('Password does not meet complexity requirements.');
    }
    // then use firebases functions for creating a new user
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // add more contextual information about the user into
    // the database
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      email: normalizedEmail,
      createdAt: new Date(),
    });

    // we scrub over the emails to see if the user is already associated with other projects
    await updateSharedProjects(normalizedEmail, user.uid);
    await registerPushToken(user.uid);

    return user;
  } catch (error) {
    console.error("Signup Error:", error.code, error.message);
    throw error;
  }
};

// handles authenticating and logging a user in
export const logIn = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;
    // register a push token on login
    await registerPushToken(user.uid);
    return user;
  } catch (error) {
    console.error("Login Error:", error.code, error.message);
    throw error;
  }
};

// basic function to log out a user
export const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Sign out Error:", error);
    throw error;
  }
};

// from the account details screen, allows the user to update their display nam
export const updateDisplayName = async (newDisplayName) => {
  try {
    // check the user is authenticated before making a change
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");
    // update the user profile
    await updateProfile(user, { displayName: newDisplayName });
    // and update the user in the user table
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { displayName: newDisplayName });

    return true;
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};

// uses firebases functionalities to send a password reset email
export const sendResetPasswordEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No authenticated user or email found.");
    }

    await sendPasswordResetEmail(auth, user.email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// when a user is added to a project and the user doesnt have an account
// it stores the email address instead of the userid. When a new user signs up
// it scrubs over the shared with section and updates them to the new userid
export const updateSharedProjects = async (email, userId) => {
  try {
    // get the projects that have the email in shared with
    const projectsRef = collection(db, 'projects');
    const normalizedEmail = email.trim().toLowerCase();
    const q = query(projectsRef, where('sharedWith', 'array-contains', normalizedEmail));
    const querySnapshot = await getDocs(q);
    // for each project update the email with the userid
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
    console.error("Error updating shared projects:", error);
    throw error;
  }
};

// small utility that gets the first names for an array of user ids that is passed to it
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
    console.error("Error fetching user names:", error);
    return {};
  }
};