//================ProjectService.js==============//
// handles various database operations related
// to projects for the application
//==============================================//

import { useCallback } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

//Creates a new project passing it the project data
//entered by the user form
export const createProject = async (projectData) => {
  try {
    const projectsCollectionRef = collection(db, "projects");
    const newProject = {
      ...projectData,
      createdAt: serverTimestamp(),
      isActive: true,
    };
    const docRef = await addDoc(projectsCollectionRef, newProject);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

//Fetches all projects that the user has created or 
//had shared with
export const fetchProjects = async (userId, userEmail=null) => {
  try {
    // if there is no userid then return nothing
    if (!userId) return [];

    // get all the active projects created by the user
    const createdByQuery = query(
      collection(db, "projects"),
      where("createdBy", "==", userId),
      where("isActive", "==", true)
    );
    // get all the active projects shared with the user
    const sharedWithQuery = query(
      collection(db, "projects"),
      where("sharedWith", "array-contains-any", [userId, userEmail.trim().toLowerCase()]),
      where("isActive", "==", true)
    );
    // then query the database for the above two criteria
    const [createdSnapshot, sharedSnapshot] = await Promise.all([
      getDocs(createdByQuery),
      getDocs(sharedWithQuery),
    ]);

    //initiate the object to store the project info in
    const projectsMap = {};

    // then map each query result into the projects map
    createdSnapshot.docs.forEach((doc) => {
      projectsMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    sharedSnapshot.docs.forEach((doc) => {
      projectsMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    // then return the project details
    return Object.values(projectsMap);
  } catch (error) {
    throw error;
  }
};

// Gets all the users associated with a project id
export const fetchProjectUserIds = async (projectId) => {
  try {
    // if there is no project id provided then throw an error
    if (!projectId) throw new Error("Project ID is required.");

    // build the query and execute
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    // check to make sure the document exists, if not
    // just return an empty array
    if (!projectDoc.exists()) return [];

    //destruct the data to the variables
    const { createdBy, sharedWith = [] } = projectDoc.data();
    // then return the complete array with created by first
    return createdBy ? [createdBy, ...sharedWith] : sharedWith;
  } catch (error) {
    throw error;
  }
};

// this updates the project title and description
export const updateProject = async (projectId, data) => {
  try {
    // check to make sure the project id is present
    if (!projectId) throw new Error("Project ID is required for update.");
    // get the project we are updating
    const projectRef = doc(db, "projects", projectId);
    // then update the project with the data
    await updateDoc(projectRef, data);
  } catch (error) {
    throw error;
  }
};

// This does a soft delete, so the data can be recovered
// after a set period of time we use firebase functions to permanently
// delete the data
export const deleteProject = async (projectId) => {
  try {
    if (!projectId) throw new Error("Project ID is required for deletion.");

    const projectRef = doc(db, "projects", projectId);
    // Mark the project as inactive instead of deleting it
    // firebase will loop over these every 24 hours and get it
    await updateDoc(projectRef, {
      isActive: false,
      deletedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};


// adds additional user into the shared with section
export const addUserToProject = async (projectId, userEmail) => {
  try {
    // the user is added using their email address
    const emailLower = userEmail.trim().toLowerCase();

    // we then check if the email is already associated with an account
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", emailLower));
    const userSnapshot = await getDocs(userQuery);

    //get the project information
    const projectRef = doc(db, "projects", projectId);

    // if there is no user associated with the email
    // then we store just the email. When a new account
    // is created we scrub over these and update with the user id
    if (userSnapshot.empty) {
      await updateDoc(projectRef, {
        sharedWith: arrayUnion(emailLower),
      });
    } else {
      // otherwise we update the shared with section to include the new user id
      const existingUserId = userSnapshot.docs[0].id;
      await updateDoc(projectRef, {
        sharedWith: arrayUnion(existingUserId),
      });
    }
  } catch (error) {
    throw error;
  }
};

// grabs a project for a specific id handed to it
export const fetchProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const snapshot = await getDoc(projectRef);
    const data = snapshot.data();
    // return project object
    return {
      id: snapshot.id,
      name: data.name || "Untitled",
      description: data.description || "",
      ownerId: data.ownerId || "",
      sharedWith: data.sharedWith || [],
      archived: data.archived || false,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
}

// CUSTOM HOOK PROJECT SERVICE
// Allows us to export all the project functions for ease
export const useProjectService = () => {
  const { userId, userEmail } = useUser();

  const memoizedFetchProjects = useCallback(
    () => fetchProjects(userId, userEmail),
    [userId, userEmail]
  );

  return {
    fetchProjects: memoizedFetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addUserToProject,
    fetchProjectUserIds,
  };
};