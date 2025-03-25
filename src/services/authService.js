/**
 * authService.js
 *
 * A Firebase Authentication service module providing signup, login, and user utilities.
 * Implements Firebase Authentication (Email & Password) with best practices:
 * - Email normalization
 * - Password validation
 * - Error handling and propagation
 * - Optimized Firestore queries
 */

import { auth, db } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
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
} from 'firebase/firestore'; // ✅ Removed duplicate import

// ========================================
// Password complexity validation function
// (Adjust according to your security policies)
// ===========================================
const validatePasswordComplexity = (password) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasLowercase && hasUppercase && hasNumber && hasSpecialChar && isLongEnough;
};

// ===============================================
// Creates a new Firebase user & stores additional user details in Firestore
// https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
//==============================================================
export const signUp = async (email, password, firstName, lastName) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Validate password complexity before sending to Firebase
    if (!validatePasswordComplexity(password)) {
      throw new Error('Password does not meet complexity requirements.');
    }

    // Create user account with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    // Update user profile (optional, but good practice)
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    // Save additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email: normalizedEmail,
      createdAt: new Date()
    });

    // Update any existing shared projects with this user's email
    await updateSharedProjects(normalizedEmail, user.uid);

    return user;

  } catch (error) {
    console.error("❌ Signup Error:", error.code, error.message);
    throw error; // propagate error for proper UI handling
  }
};

//==============================================================
// Logs in existing users via Firebase Authentication
// https://firebase.google.com/docs/auth/web/password-auth#sign_in_a_user_with_an_email_address_and_password
//==============================================================
export const logIn = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Error logging in:", error.code, error.message);
    throw error; // propagate error to caller
  }
};

//==============================================================
// Updates projects shared by email to replace email with userId
//==============================================================
export const updateSharedProjects = async (email, userId) => {
  try {
    const projectsRef = collection(db, "projects");
    const normalizedEmail = email.trim().toLowerCase();

    const q = query(projectsRef, where("sharedWith", "array-contains", normalizedEmail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      const projectData = docSnapshot.data();
      const updatedSharedWith = projectData.sharedWith.map(entry => 
        entry === normalizedEmail ? userId : entry
      );

      // Update Firestore document
      await updateDoc(doc(db, "projects", docSnapshot.id), {
        sharedWith: updatedSharedWith
      });
    });
  } catch (error) {
    console.error("Error updating shared projects:", error);
    throw error;
  }
};

//==============================================================
// Fetches user names from Firestore based on an array of user IDs
//==============================================================
export const fetchUserNamesByIds = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) return {};

    // Firestore 'in' query allows up to 30 IDs per query
    const userChunks = [];
    for (let i = 0; i < userIds.length; i += 30) {
      userChunks.push(userIds.slice(i, i + 30));
    }

    const names = {};
    for (const chunk of userChunks) {
      const q = query(collection(db, "users"), where("__name__", "in", chunk));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnapshot) => {
        names[docSnapshot.id] = docSnapshot.data().firstName; // Adjust to your data structure
      });
    }

    return names;
  } catch (error) {
    console.error("❌ Error fetching user names:", error);
    return {};
  }
};