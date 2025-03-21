//==============================//
// projectService.js            //
//==============================//
// This module handles the logic for creating and accessing projects
// in Firestore. It includes functions for adding a new project,
// as well as fetching projects created by or shared with a user.
//==============================//

import { useCallback } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  where,
  query,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

/**
 * Fetch all projects associated with a given user.
 * This includes projects created by the user and projects shared with them.
 *
 * @param {string} userId - The user's ID.
 * @param {string} userEmail - The user's email (for shared projects).
 * @returns {Promise<Array>} - Returns an array of unique projects.
 */
const fetchProjects = async (userId, userEmail) => {
  try {

    if (!userId || !userEmail) {
      console.warn("⚠️ Missing userId or userEmail in fetchProjects");
      return [];
    }

    // Query for projects created by the user
    const createdByQuery = query(
      collection(db, "projects"),
      where("createdBy", "==", userId)
    );

    // Query for projects shared with the user (by ID or email)
    const sharedWithQuery = query(
      collection(db, "projects"),
      where("sharedWith", "array-contains-any", [userId, userEmail.trim()])
    );

    // Execute both queries in parallel for efficiency
    const [createdBySnapshot, sharedWithSnapshot] = await Promise.all([
      getDocs(createdByQuery),
      getDocs(sharedWithQuery),
    ]);

    // Map documents to project objects
    const createdByProjects = createdBySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sharedWithProjects = sharedWithSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Combine and remove duplicates using a hashmap
    const allProjects = [...createdByProjects, ...sharedWithProjects].reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, {});

    return Object.values(allProjects);
  } catch (error) {
    console.error("❌ Error fetching projects: ", error);
    throw error;
  }
};

/**
 * Retrieves the list of user IDs that a given project is shared with.
 *
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<string[]>} - Returns an array of user IDs.
 */
const fetchProjectUserIds = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error("No project ID provided.");
    }

    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (projectDoc.exists()) {
      const projectData = projectDoc.data();
      const sharedWith = Array.isArray(projectData.sharedWith) ? projectData.sharedWith : [];
      const projectCreator = projectData.createdBy || null;
      return projectCreator ? [projectCreator, ...sharedWith] : sharedWith;
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching project user IDs:", error);
    throw error;
  }
};

/**
 * React Hook for managing projects.
 * This hook provides functions for fetching projects.
 */
const useProjectService = () => {
  const { userId, userEmail } = useUser();

  // ✅ Memoize fetchProjects to prevent excessive re-renders
  const memoizedFetchProjects = useCallback(() => fetchProjects(userId, userEmail), [userId, userEmail]);

  return {
    fetchProjects: memoizedFetchProjects,
  };
};

//==============================//
// Exports (All at the Bottom)  //
//==============================//
// ✅ Ensure functions are only exported once
export { fetchProjectUserIds, fetchProjects };
export default useProjectService;