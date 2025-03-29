//================Storage Service.js==============//
// handles interacting with firebase storage for
// files and images
//==============================================//

import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaType,
} from "expo-image-picker";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../config/firebaseConfig"; 
import { Platform } from "react-native";

//converts a local file to a blob (required for firestore)
//https://stackoverflow.com/questions/48108791/convert-image-path-to-blob-react-native
const uriToBlob = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting URI to Blob:", error);
    throw error;
  }
};


// uploads a file into firebase storage
export const uploadFile = async (uri, storagePath, onProgress) => {
  try {
    if (!uri || typeof uri !== "string") {
      throw new Error("Invalid URI provided.");
    }
    // check the uri is in teh right format
    if (!uri.startsWith("file://")) {
      console.warn("URI does not start with file:// — may cause upload failure:", uri);
    }
    // convert it to blob
    const blob = await uriToBlob(uri);
    const storageRef = ref(storage, storagePath);

    // then upload
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // while it is uploading pass back to the percentage so this can be displayed
    // to the user
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Firebase Upload Error:", {
            code: error.code,
            message: error.message,
            serverResponse: error.serverResponse,
          });
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("uploadFile failed:", error);
    throw error;
  }
};