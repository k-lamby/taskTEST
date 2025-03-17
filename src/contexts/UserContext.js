//================== UserContext.js ===========================//
// We want to be able to access certain user level information
// throughout the app. This allows us to ensure we tag new projects
// and events to the correct person.
//=============================================================//

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Create the new context for the user
const UserContext = createContext();

// Create a provider, this will wrap around the components that
// I want to pass the user details to
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [firstName, setFirstName] = useState(null); // Store user's first name

  // This effect listens for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserId(firebaseUser.uid); // Store the Firebase user ID
        setUserEmail(firebaseUser.email); // Store the user's email

        // Extract first name from Firebase's displayName
        const fullName = firebaseUser.displayName || "User";
        const extractedFirstName = fullName.split(" ")[0]; // Gets only the first name
        setFirstName(extractedFirstName);
      } else {
        setUserId(null);
        setUserEmail(null);
        setFirstName(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // This will be what is passed to the components
  // setUserId allows us to update it when the user is logging in
  return (
    <UserContext.Provider value={{ userId, setUserId, userEmail, setUserEmail, firstName, setFirstName }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for simplicity in accessing the UserContext
export const useUser = () => useContext(UserContext);