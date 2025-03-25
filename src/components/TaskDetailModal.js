//================== TaskDetailModal.js ===========================//
// Task detail modal allows the user to upload images, files, and messages
// associated with that task, as well as change the due date
// and who the task is associated with
//========================================================//

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";
import CustomDatePicker from "./CustomDatePicker";
import UserPickerModal from "./UserPickerModal";
import GlobalStyles from "../styles/styles";
import { addActivity } from "../services/activityService";

const TaskDetailModal = ({ task, visible, onClose, onUpdateTask, projectUsers }) => {
  const { userId } = useUser();
  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);

  console.log("📌 TaskDetailModal Rendered");
  console.log("📌 Project Users:", projectUsers);

  // Assigned to is the user ID, here we grab the username
  const assignedUser = projectUsers.find(user => user.id === assignedTo);
  const assignedUserName = assignedUser ? assignedUser.name : "Unassigned";

  // Handles the file upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", multiple: false });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("TaskDetailModal - Error selecting file:", error);
    }
  };

  // Handles the image upload
  const handleImageUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*", multiple: false });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("TaskDetailModal - Error selecting image:", error);
    }
  };

  // Handles the uploading of the file and closes the modal after upload
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await addActivity(task.projectId, task.id, {
        type: "file",
        content: selectedFile.name,
        fileUrl: selectedFile.uri,
        timestamp: new Date(),
        userId,
      });
      setSelectedFile(null);
      onClose(); // ✅ Automatically close the modal after upload
    } catch (error) {
      console.error("TaskDetailModal - Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[GlobalStyles.headerText, styles.modalHeader]}>{task.name}</Text>
          <Text style={GlobalStyles.normalText}>{task.description}</Text>

          {/* Assigned User Picker */}
          <TouchableOpacity style={styles.clickableField} onPress={() => setShowUserPicker(true)}>
            <FontAwesome name="user" size={18} color="orange" />
            <Text style={styles.clickableText}>Assigned To: {assignedUserName}</Text>
          </TouchableOpacity>

          {/* Due Date Picker */}
          <TouchableOpacity style={styles.clickableField} onPress={() => setShowDatePicker(true)}>
            <FontAwesome name="calendar" size={18} color="orange" />
            <Text style={styles.clickableText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>

          <CustomDatePicker visible={showDatePicker} onClose={() => setShowDatePicker(false)} onDateChange={setDueDate} title="Select Due Date" />

          {/* User Picker Modal - Now returns user ID */}
          <UserPickerModal
            visible={showUserPicker}
            onClose={() => setShowUserPicker(false)}
            onUserSelected={(user) => setAssignedTo(user.id)} // Store ID, not name
            projectUsers={projectUsers}
          />

          {/* Upload Buttons */}
          <View style={styles.uploadOptions}>
            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadIcon}>
              <FontAwesome name="paperclip" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImageUpload} style={styles.uploadIcon}>
              <FontAwesome name="image" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={GlobalStyles.primaryButton} 
            onPress={handleConfirmUpload} 
            disabled={!selectedFile || uploading}
          >
            <Text style={GlobalStyles.primaryButtonText}>
              {uploading ? "Uploading..." : "Submit"}
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailModal;

// ================== Styles ================== //
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#15616D",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    marginBottom: 10,
    textAlign: "center",
  },
  clickableField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  clickableText: {
    marginLeft: 10,
    color: "white",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  uploadIcon: {
    padding: 10,
  },
  closeButton: {
    marginTop: 15,
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});