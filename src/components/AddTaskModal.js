//================== Add Task Modal.js ===========================//
// This is a pop up window for adding a task to the database
// it slides up from the bottom, very similar to the add projects
// modal. Allows the user to add the task/description and assign to a user
//====================================================================//
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import CustomDatePicker from "./CustomDatePicker";
import UserPickerModal from "./UserPickerModal";
import GlobalStyles from "../styles/styles";
import { useUser } from "../contexts/UserContext";

const AddTaskModal = ({ visible, onClose, onTaskAdded, projectId, projectUsers, createTaskWithSubtasks }) => {
  // use the user context to grab the current user details
  const { userId, firstName } = useUser(); 

  // store the form inputs
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  // use this to grab the assigned user from the user modal
  const [assignedUser, setAssignedUser] = useState({ id: userId, name: firstName });

  // states to control the visibility of the date picker and user picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);

  // here we handle adding the task
  const handleAddTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Task name is required!");
      return;
    }

    // the store the added information
    await createTaskWithSubtasks(projectId, taskName, dueDate, assignedUser.id);

    // Reset form after adding
    setTaskName("");
    setTaskDescription("");
    setDueDate(new Date());
    setAssignedUser({ id: userId, name: firstName });
    onTaskAdded();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>Add Task</Text>

            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack]}
              placeholder="Task Name"
              placeholderTextColor="black"
              value={taskName}
              onChangeText={setTaskName}
            />

            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack, styles.descriptionInput]}
              placeholder="Task Description"
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={6}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />

            <View style={styles.dueDateContainer}>
              <Text style={[GlobalStyles.normalText, styles.dueDateLabel]}>Due Date</Text>
              <Pressable style={[GlobalStyles.inputContainer, styles.dateContainer]} onPress={() => setShowDatePicker(true)}>
                <Text style={GlobalStyles.normalTextBlack}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            {/* ✅ FIXED: Display assignedUser name instead of id */}
            <View style={styles.userContainer}>
              <Text style={[GlobalStyles.normalText, styles.userLabel]}>Assign To</Text>
              <Pressable style={[GlobalStyles.inputContainer, styles.userInput]} onPress={() => setShowUserPicker(true)}>
                <Text style={GlobalStyles.normalTextBlack}>
                  {assignedUser?.name || "Select User"}
                </Text>
              </Pressable>
            </View>

            <Pressable style={[GlobalStyles.primaryButton, styles.createButton]} onPress={handleAddTask}>
              <Text style={GlobalStyles.primaryButtonText}>Add Task</Text>
            </Pressable>

            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Select Due Date"
      />

      <UserPickerModal
        visible={showUserPicker}
        onClose={() => setShowUserPicker(false)}
        onUserSelected={(user) => setAssignedUser(user)} // ✅ FIXED: store entire user object
        projectUsers={projectUsers}
      />
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "flex-end" },
  modalContainer: { height: "75%", width: "90%", backgroundColor: "#15616D", borderTopLeftRadius: 100, borderTopRightRadius: 100, padding: 20, alignSelf: "center", alignItems: "center" },
  modalHeader: { marginBottom: 20, marginTop: 20, textAlign: "center" },
  descriptionInput: { height: 120, textAlignVertical: "top" },
  dueDateContainer: { width: "100%", marginTop: 10 },
  dueDateLabel: { paddingLeft: 3 },
  dateContainer: { justifyContent: "center" },
  userContainer: { width: "100%", marginTop: 10 },
  userLabel: { paddingLeft: 3 },
  userInput: { justifyContent: "center" },
  createButton: { marginTop: 20 },
  closeButton: { marginTop: 10, color: "#FFFFFF", textDecorationLine: "underline", textAlign: "center" },
});

export default AddTaskModal;