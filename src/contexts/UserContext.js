//==================== UserContext.js ==========================//
// provides global user authentication states for the current
// logged in user.
//================================================================//

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// create the user context
const UserContext = createContext(null);

// user provider wraps around our components providing it with the states
// and functions
export const UserProvider = ({ children }) => {
  // we want to capture these when the user logs authenticates
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);

  useEffect(() => {
    // use firebase auth
    const auth = getAuth();

    // update user details whenever auth state changes
    // https://stackoverflow.com/questions/42762443/how-can-i-unsubscribe-to-onauthstatechanged
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        //if the user exists then update the context
        setUserId(firebaseUser.uid);
        setUserEmail(firebaseUser.email);

        const fullName = firebaseUser.displayName || "User";
        const extractedFirstName = fullName.split(" ")[0];
        setFirstName(extractedFirstName);
      } else {
        // otherwise set everything back to null
        setUserId(null);
        setUserEmail(null);
        setFirstName(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // return the context so this can be used by other screens
  return (
    <UserContext.Provider value={{ 
      userId, setUserId, 
      userEmail, setUserEmail, 
      firstName, setFirstName,
    }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook for clean usage
export const useUser = () => useContext(UserContext);

export default UserContext;