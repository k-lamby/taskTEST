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
  Alert,
  StyleSheet,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { User, CalendarDays, Paperclip, Image as ImageIcon, MessageCircle, X } from "lucide-react-native";

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

  const assignedUser = projectUsers.find((user) => user.id === assignedTo);
  const assignedUserName = assignedUser ? assignedUser.name : "Unassigned";

  // Handles file selection
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  // Handles image selection
  const handleImageUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  // Uploads selected file or message
  const handleConfirmUpload = async () => {
    if (!selectedFile && !message.trim()) {
      Alert.alert("Nothing to submit", "Please select a file or enter a message.");
      return;
    }

    setUploading(true);

    try {
      if (selectedFile) {
        await addActivity(task.projectId, task.id, {
          type: "file",
          content: selectedFile.name,
          fileUrl: selectedFile.uri,
          timestamp: new Date(),
          userId,
        });
      }

      if (message.trim()) {
        await addActivity(task.projectId, task.id, {
          type: "message",
          content: message.trim(),
          timestamp: new Date(),
          userId,
        });
      }

      // Reset and notify parent
      setSelectedFile(null);
      setMessage("");
      setShowMessageInput(false);
      onUpdateTask?.(); // Optional callback if task is updated
      onClose(); // Close modal
    } catch (error) {
      Alert.alert("Upload Failed", "Unable to upload content.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={GlobalStyles.modalOverlay}>
        <View style={GlobalStyles.modalContainer}>
          <Text style={[GlobalStyles.headerText, styles.modalHeader]}>{task.name}</Text>
          <Text style={GlobalStyles.normalText}>{task.description}</Text>

          {/* Assigned To */}
          <TouchableOpacity
            style={styles.clickableField}
            onPress={() => setShowUserPicker(true)}
            accessibilityLabel={`Assigned to ${assignedUserName}`}
          >
            <User size={18} color="orange" />
            <Text style={styles.clickableText}>Assigned To: {assignedUserName}</Text>
          </TouchableOpacity>

          {/* Due Date */}
          <TouchableOpacity
            style={styles.clickableField}
            onPress={() => setShowDatePicker(true)}
            accessibilityLabel={`Due date: ${dueDate.toDateString()}`}
          >
            <CalendarDays size={18} color="orange" />
            <Text style={styles.clickableText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>

          {/* Upload Buttons */}
          <View style={styles.uploadOptions}>
            <TouchableOpacity
              onPress={handleFileUpload}
              style={styles.uploadIcon}
              accessibilityLabel="Upload a document"
            >
              <Paperclip size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.uploadIcon}
              accessibilityLabel="Upload an image"
            >
              <ImageIcon size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowMessageInput(!showMessageInput)}
              style={styles.uploadIcon}
              accessibilityLabel="Add a message"
            >
              <MessageCircle size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* File name display */}
          {selectedFile && (
            <Text style={[GlobalStyles.normalText, { marginTop: 8 }]}>
              Selected: {selectedFile.name}
            </Text>
          )}

          {/* Message input */}
          {showMessageInput && (
            <View style={GlobalStyles.inputContainer}>
              <TextInput
                placeholder="Enter a message"
                placeholderTextColor="#444"
                value={message}
                onChangeText={setMessage}
                multiline
                style={GlobalStyles.textInput}
              />
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={GlobalStyles.primaryButton}
            onPress={handleConfirmUpload}
            disabled={uploading}
            accessibilityLabel="Submit file or message"
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={GlobalStyles.primaryButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close modal"
            style={styles.closeContainer}
          >
            <X size={20} color="white" />
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>

          {/* Modals */}
          <CustomDatePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateChange={setDueDate}
            title="Select Due Date"
          />
          <UserPickerModal
            visible={showUserPicker}
            onClose={() => setShowUserPicker(false)}
            onUserSelected={(user) => setAssignedTo(user.id)}
            projectUsers={projectUsers}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailModal;

const styles = StyleSheet.create({
  modalHeader: {
    marginBottom: 10,
    textAlign: "center",
  },
  clickableField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    alignSelf: "stretch",
  },
  clickableText: {
    marginLeft: 10,
    color: "white",
    flexShrink: 1,
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
    marginBottom: 10,
  },
  uploadIcon: {
    backgroundColor: "#1992D4",
    padding: 10,
    borderRadius: 10,
  },
  closeContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  closeButton: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
    marginTop: 4,
  },
});