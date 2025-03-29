//================== TaskDetailModal.js =======================//
// task detail modal, handles alot of functionality. Allows the
// user to change who the task is assigned to, its due date. As 
// well as adding 
//==============================================================//
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

// various props sent to it, including a callback when the task is updated
const TaskDetailModal = ({
  task,
  visible,
  onClose,
  onUpdateTask,
  projectUsers,
}) => {
  // get the user context
  const { userId } = useUser();
  //states for storing changes made to the existing task info
  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [priority, setPriority] = useState(task.priority || "medium");
  // states for showing the modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  // uploading takes a bit of time so we want to set a loading state
  const [uploading, setUploading] = useState(false);
  // grab the selected file details and or message
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  //state to control whether the message box is visible or not.
  const [showMessageInput, setShowMessageInput] = useState(false);
  // get the current assigned user, and their user name
  const assignedUser = projectUsers.find((user) => user.id === assignedTo);
  const assignedUserName = assignedUser ? assignedUser.name : "Unassigned";
  // function to handle uploading the file
  const handleFileUpload = async () => {
    try {
      // use the document picker to access the users files and grab the document
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      // if its cancelled, then dont do anything
      if (result.canceled) return;
      // otherwise grab the file, and add the name add the uri to the state
      const file = result.assets[0];
      setSelectedFile({
        name: file.name,
        uri: file.uri,
        type: file.mimeType,
      });
    } catch (error) {
      Alert.alert("Error selecting file:", error);
    }
  };
  // similar structure for handling the image upload, but filter by the type image
  // we should amend this in a future iteration to use the camera/photo section in ios
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

  // then handle confirming the upload
  const handleConfirmUpload = async () => {
    // check to see what information has changed
    const unchanged =
      assignedTo === task.owner &&
      dueDate.toDateString() === new Date(task.dueDate).toDateString() &&
      priority === task.priority &&
      !selectedFile &&
      !message.trim();
    // if nothing has changed then just cancel and return a message
    if (unchanged) {
      Alert.alert("No changes made", "Please make at least one change.");
      return;
    }
    // otherwise set uploading to true
    setUploading(true);

    try {
      // and then start actually uploading the data to the database
      if (selectedFile) {
        const timestamp = Date.now();
        const safeFilename = selectedFile.name.replace(/\s+/g, "_").toLowerCase();
        // build the storage path
        const storagePath = `tasks/${task.id}/attachments/${timestamp}_${safeFilename}`;
        // and then upload the file
        const downloadURL = await uploadFile(selectedFile.uri, storagePath);
        // we then want to add an activity to firestore, so the user can access the file
        await addActivity({
          projectId: task.projectId,
          taskId: task.id,
          userId,
          type: "file",
          content: selectedFile.name,
          fileUrl: downloadURL,
        });
      }
      // if there is a message, we want to add that to the activity to
      if (message.trim()) {
        await addActivity({
          projectId: task.projectId,
          taskId: task.id,
          userId,
          type: "message",
          content: message.trim(),
        });
      }
      // if any other information has changed, then we update that information too
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
      // clear the form fields
      setSelectedFile(null);
      setMessage("");
      setShowMessageInput(false);
      // and then close the modal
      onClose();
    } catch (error) {
      Alert.alert("Upload Failed", "An error occurred while uploading. Please try again.");
    } finally {
      // then reset loading to false
      setUploading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={GlobalStyles.modal.overlay}>
        <View style={GlobalStyles.modal.container}>
          <Text style={GlobalStyles.text.headerLg}>{task.name}</Text>
          <Text style={GlobalStyles.text.white}>{task.description}</Text>

          {/* Assigned to section, clickable to open the user picker modal */}
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

          {/* Due date, clickable to open the custom date picker */}
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

          {/* Priority selector, with inline js for handling the styles of the icons */}
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

          {/* upload icons, allows the user to select what action theyd like */}
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

          {/* Display the file name to indicate to the user its keyed up and ready to go */}
          {selectedFile && (
            <Text style={[GlobalStyles.text.white, { marginTop: 8 }]}>
              Selected: {selectedFile.name}
            </Text>
          )}

          {/* Message input box, hidden until you press the icon */}
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

          {/* Submit button, shows the loading icon when loading is true */}
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

          <TouchableOpacity onPress={onClose} accessibilityLabel="Close modal">
            <Text style={GlobalStyles.text.closeButton}>Close</Text>
          </TouchableOpacity>

          {/* custom date picker modal */}
          <CustomDatePicker
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onDateChange={setDueDate}
            title="Select Due Date"
          />

          {/* modal for selecting the user */}
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

// ===== Page specific styles ======= //
const styles = StyleSheet.create({
  centeredRow: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    paddingLeft: 10,
  },
});