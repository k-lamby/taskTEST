import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync, MediaType } from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
//https://stackoverflow.com/questions/56830482/should-i-upload-images-to-cloud-firestore-or-firebase-storage
/**
 * Converts a local file URI (Expo) to a Blob for Firebase Storage.
 * @param {string} uri - The local file URI (must have `file://` prefix).
 * @returns {Promise<Blob>} - A Blob object for upload.
 */
const uriToBlob = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
    return await response.blob();
  } catch (error) {
    console.error("❌ Error converting URI to Blob:", error);
    throw error;
  }
};

/**
 * Opens the image picker and returns the selected file.
 * @param {string} mediaType - "image" or "document"
 * @returns {Promise<{uri: string, fileName: string} | null>}
 */
export const selectFile = async (mediaType) => {
  try {
    // ✅ Request media library permissions
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access media library is required!");
    }

    // ✅ Open image picker
    const result = await launchImageLibraryAsync({
      mediaTypes: mediaType === "image" ? [MediaType.IMAGE] : [MediaType.ALL],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return null;

    const file = result.assets[0]; // ✅ Get selected file
    return { uri: file.uri, fileName: file.fileName };
  } catch (error) {
    console.error("❌ Error selecting file:", error);
    throw error;
  }
};
/**
 * Uploads a file to Firebase Storage with resumable uploads.
 * @param {string} uri - The local file URI.
 * @param {string} storagePath - The path in Firebase Storage.
 * @param {function} [onProgress] - Optional callback for tracking upload progress.
 * @returns {Promise<string>} - Returns the download URL of the uploaded file.
 */
export const uploadFile = async (uri, storagePath, onProgress) => {
  try {
    if (!uri.startsWith("file://")) {
      throw new Error("Invalid file URI. Ensure it has a `file://` prefix.");
    }

    const blob = await uriToBlob(uri);
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`📤 Upload is ${progress.toFixed(2)}% done`);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("❌ Error uploading file:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`✅ Upload successful! File available at: ${downloadURL}`);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("❌ Error uploading file to Firebase Storage:", error);
    throw error;
  }
};