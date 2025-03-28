//=======================================================//
// storageService.js
// Handles file selection and upload to Firebase Storage
//=======================================================//

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

import { storage } from "../config/firebaseConfig"; // ✅ Use centralized initialized storage
import { Platform } from "react-native";

/**
 * Converts a local file URI (e.g. file://...) to a Blob
 * required for Firebase Storage upload.
 * @param {string} uri - Local file URI
 * @returns {Promise<Blob>}
 */
const uriToBlob = async (uri) => {
  try {
    console.log("📦 Converting URI to blob:", uri);
    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
    const blob = await response.blob();
    console.log("✅ Blob created successfully");
    return blob;
  } catch (error) {
    console.error("❌ Error converting URI to Blob:", error);
    throw error;
  }
};

/**
 * Opens the media picker and allows choosing a file or image.
 * @param {"image"|"document"} mediaType
 * @returns {Promise<{uri: string, name: string, mimeType?: string} | null>}
 */
export const selectFile = async (mediaType = "image") => {
  try {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access media library is required.");
    }

    console.log("📂 Opening media picker...");
    const result = await launchImageLibraryAsync({
      mediaTypes: mediaType === "image" ? MediaType.Images : MediaType.All,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return null;

    const file = result.assets[0];
    console.log("📁 File selected:", file);

    return {
      uri: file.uri,
      name: file.fileName || `upload-${Date.now()}`,
      mimeType: file.mimeType || "application/octet-stream",
    };
  } catch (error) {
    console.error("❌ Error selecting file:", error);
    throw error;
  }
};

/**
 * Uploads a file from URI to Firebase Storage.
 * @param {string} uri - File URI (must start with file://)
 * @param {string} storagePath - Path in Firebase Storage (e.g. tasks/taskId/filename)
 * @param {function} [onProgress] - Optional progress callback
 * @returns {Promise<string>} - Public download URL after upload
 */
export const uploadFile = async (uri, storagePath, onProgress) => {
  try {
    console.log("🚀 Starting file upload...");
    if (!uri || typeof uri !== "string") {
      throw new Error("Invalid URI provided.");
    }

    if (!uri.startsWith("file://")) {
      console.warn("⚠️ URI does not start with file:// — may cause upload failure:", uri);
    }

    const blob = await uriToBlob(uri);
    const storageRef = ref(storage, storagePath); // ✅ Use pre-initialized storage

    console.log("📤 Uploading to:", storagePath);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📈 Upload progress: ${progress.toFixed(2)}%`);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("❌ Firebase Upload Error:", {
            code: error.code,
            message: error.message,
            serverResponse: error.serverResponse,
          });
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ File uploaded successfully:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("❌ uploadFile failed:", error);
    throw error;
  }
};