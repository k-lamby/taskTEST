//================== authService.js ===========================//
// Here we handle the logic associated with authenticating throughout
// the application from Firebase
//===============================================================//

import { auth, db } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";

// Creates a new user account, uses Firebase Authentication
// Stores first and last name in both Firebase Authentication (displayName)
// and Firestore (users collection)
// https://firebase.google.com/docs/auth/web/password-auth
const signUp = async (email, password, firstName, lastName) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    // ✅ Update Firebase Auth profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}` // Store full name in Firebase Auth
    });

    // ✅ Store user details in Firestore (NEW)
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: normalizedEmail,
      createdAt: new Date(),
    });

    // we then need to identify if this new user is assigned with
    // any of the existing projects.
    await updateSharedProjects(email, user.uid);

    return user;
  } catch (error) {
    // Basic error handling, will expand this out a bit more later
    console.error("Error signing up:", error);
    throw error;
  }
};

// handler function for identifying if the newly signed up user
// is already associated with any projects
const updateSharedProjects = async (email, userId) => {
  try {
    const projects = collection(db, "projects");
    
    // run a query where sharedWith array contains the new user email
    const q = query(projects, where("sharedWith", "array-contains", email.trim().toLowerCase()));
    // run the query and await the results
    const matchingProjects = await getDocs(q);

    // we then want to iterate over the matching projects
    // and swap out the email for the new user id
    const updatePromises = matchingProjects.docs.map(async (docSnapshot) => {
      // get the data associated with the project
      const projectData = docSnapshot.data();
      // if the entry matches the email, then we update it with the userId
      const updatedSharedWith = projectData.sharedWith.map(entry => 
        entry === email ? userId : entry 
      );

      // we then update the document with the modified sharedWith array
      return updateDoc(doc(db, "projects", docSnapshot.id), {
        sharedWith: updatedSharedWith
      });
    });

    // we then wait for all the updates to happen
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating shared projects:", error);
  }
};

// Uses Firebase Authentication for logging the user in
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // If there is an error logging in, logs the error
    // Will expand this to display a message back to the user
    // for a future iteration
    console.error("Error signing in:", error);
    throw error;
  }
};

// Fetches user first names from Firestore based on user IDs
const fetchUserNamesByIds = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) return {};

    let names = {};

    // Fetch names from Firestore for each user ID
    for (const userId of userIds) {
      const userDoc = await getDoc(doc(db, "users", userId)); // ✅ Query Firestore
      if (userDoc.exists()) {
        const userData = userDoc.data();
        names[userId] = userData.firstName || "Unknown"; // ✅ Store first name
        console.log("names")
        console.log(names)
        console.log("userdata")
        console.log(userData)
      } else {
        names[userId] = "Unknown"; // Fallback if user is missing
      }
    }
    return names;
  } catch (error) {
    console.error("❌ Error fetching user names:", error);
    return {};
  }
};

// Export only the functions that need to be used outside of this
export { signUp, logIn, fetchUserNamesByIds };