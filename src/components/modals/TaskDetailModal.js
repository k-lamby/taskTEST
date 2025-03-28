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
import {
  User,
  CalendarDays,
  Paperclip,
  Image as ImageIcon,
  MessageCircle,
} from "lucide-react-native";

import { useUser } from "../../contexts/UserContext";
import GlobalStyles from "../../styles/styles";
import CustomDatePicker from "./CustomDatePicker";
import UserPickerModal from "./UserPickerModal";
import { addActivity } from "../../services/activityService";
import { uploadFile } from "../../services/storageService";

const TaskDetailModal = ({
  task,
  visible,
  onClose,
  onUpdateTask,
  projectUsers,
}) => {
  const { userId } = useUser();

  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [priority, setPriority] = useState(task.priority || "medium");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);

  const assignedUser = projectUsers.find((user) => user.id === assignedTo);
  const assignedUserName = assignedUser ? assignedUser.name : "Unassigned";

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type: file.mimeType,
      });
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type: file.mimeType,
      });
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const handleConfirmUpload = async () => {
    const unchanged =
      assignedTo === task.owner &&
      dueDate.toDateString() === new Date(task.dueDate).toDateString() &&
      priority === task.priority &&
      !selectedFile &&
      !message.trim();

    if (unchanged) {
      Alert.alert("No changes made", "Please make at least one change.");
      return;
    }

    setUploading(true);

    try {
      // 📎 Upload file activity
      if (selectedFile) {
        const timestamp = Date.now();
        const safeFilename = selectedFile.name.replace(/\s+/g, "_").toLowerCase();
        const storagePath = `tasks/${task.id}/attachments/${timestamp}_${safeFilename}`;
        const downloadURL = await uploadFile(selectedFile.uri, storagePath);

        await addActivity({
          projectId: task.projectId,
          taskId: task.id,
          userId,
          type: "file",
          content: selectedFile.name,
          fileUrl: downloadURL,
        });
      }

      // 💬 Submit message activity
      if (message.trim()) {
        await addActivity({
          projectId: task.projectId,
          taskId: task.id,
          userId,
          type: "message",
          content: message.trim(),
        });
      }

      // 🛠️ Update task details
      const hasTaskChanged =
        assignedTo !== task.owner ||
        dueDate.toDateString() !== new Date(task.dueDate).toDateString() ||
        priority !== task.priority;

      if (hasTaskChanged) {
        onUpdateTask?.({
          id: task.id,
          updates: {
            owner: assignedTo,
            dueDate,
            priority,
          },
        });
      }

      setSelectedFile(null);
      setMessage("");
      setShowMessageInput(false);
      onClose();
    } catch (error) {
      Alert.alert("Upload Failed", "An error occurred while uploading. Please try again.");
      console.error("❌ Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={GlobalStyles.modal.overlay}>
        <View style={GlobalStyles.modal.container}>
          {/* 🔠 Task Header */}
          <Text style={GlobalStyles.text.headerLg}>{task.name}</Text>
          <Text style={GlobalStyles.text.white}>{task.description}</Text>

          {/* 👤 Assigned To */}
          <TouchableOpacity
            style={[GlobalStyles.utility.clickableRow, styles.centeredRow]}
            onPress={() => setShowUserPicker(true)}
            accessibilityLabel={`Assigned to ${assignedUserName}`}
          >
            <User size={24} color="orange" />
            <Text style={[GlobalStyles.text.white, styles.rowText]}>
              Assigned To: {assignedUserName}
            </Text>
          </TouchableOpacity>

          {/* 📅 Due Date */}
          <TouchableOpacity
            style={[GlobalStyles.utility.clickableRow, styles.centeredRow]}
            onPress={() => setShowDatePicker(true)}
            accessibilityLabel={`Due date: ${dueDate.toDateString()}`}
          >
            <CalendarDays size={24} color="orange" />
            <Text style={[GlobalStyles.text.white, styles.rowText]}>
              Due Date: {dueDate.toDateString()}
            </Text>
          </TouchableOpacity>

          {/* 🚦 Priority Selector */}
          <Text style={[GlobalStyles.text.white, GlobalStyles.input.label]}>
            Priority
          </Text>
          <View style={GlobalStyles.priority.optionsRow}>
            {["low", "medium", "high"].map((level) => {
              const isSelected = priority === level;
              const buttonStyle = [
                GlobalStyles.priority.base,
                GlobalStyles.priority[level],
                isSelected ? { opacity: 1 } : { opacity: 0.5 },
              ];

              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setPriority(level)}
                  accessibilityLabel={`Set priority to ${level}`}
                  style={buttonStyle}
                >
                  <Text style={GlobalStyles.priority.text}>{level}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 📎 Upload Row */}
          <View style={GlobalStyles.utility.uploadRow}>
            <TouchableOpacity
              onPress={handleFileUpload}
              style={GlobalStyles.button.secondary}
              accessibilityLabel="Upload a document"
            >
              <Paperclip size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleImageUpload}
              style={GlobalStyles.button.secondary}
              accessibilityLabel="Upload an image"
            >
              <ImageIcon size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMessageInput(!showMessageInput)}
              style={GlobalStyles.button.secondary}
              accessibilityLabel="Add a message"
            >
              <MessageCircle size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* 📝 Filename */}
          {selectedFile && (
            <Text style={[GlobalStyles.text.white, { marginTop: 8 }]}>
              Selected: {selectedFile.name}
            </Text>
          )}

          {/* 💬 Message Input */}
          {showMessageInput && (
            <View style={GlobalStyles.input.container}>
              <TextInput
                placeholder="Enter a message"
                placeholderTextColor="white"
                value={message}
                onChangeText={setMessage}
                multiline
                style={GlobalStyles.input.multiline}
                accessibilityLabel="Enter a message"
              />
            </View>
          )}

          {/* ✅ Submit Button */}
          <TouchableOpacity
            style={GlobalStyles.button.primary}
            onPress={handleConfirmUpload}
            disabled={uploading}
            accessibilityLabel="Submit changes"
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={GlobalStyles.button.text}>Submit</Text>
            )}
          </TouchableOpacity>

          {/* ❌ Close Button */}
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close modal">
            <Text style={GlobalStyles.text.closeButton}>Close</Text>
          </TouchableOpacity>

          {/* 📅 Date Picker */}
          <CustomDatePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateChange={setDueDate}
            title="Select Due Date"
          />

          {/* 👥 User Picker */}
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

// ================== Local Styles ================== //
const styles = StyleSheet.create({
  centeredRow: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    paddingLeft: 10,
  },
});