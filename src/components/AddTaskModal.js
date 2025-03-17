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
  // the assign to, will have this as the default user
  const { userId, firstName } = useUser(); 

  // use this to store the form inputs
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [assignedUser, setAssignedUser] = useState(userId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);

  // We then need to grab all the users associated with this project
  // the user should only be able to assign tasks to this group
  const handleAddTask = async () => {
    if (!taskName.trim()) {
      alert("Task name is required!");
      return;
    }

    await createTaskWithSubtasks(projectId, taskName, dueDate, assignedUser);

    setTaskName("");
    setTaskDescription("");
    setDueDate(new Date());
    setAssignedUser(firstName);
    onTaskAdded();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>Add Task</Text>

            {/* Task Name */}
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack]}
              placeholder="Task Name"
              placeholderTextColor="black"
              value={taskName}
              onChangeText={setTaskName}
            />

            {/* Task Description */}
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack, styles.descriptionInput]}
              placeholder="Task Description"
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={6}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />

            {/* Due Date */}
            <View style={styles.dueDateContainer}>
              <Text style={[GlobalStyles.normalText, styles.dueDateLabel]}>Due Date</Text>
              <Pressable style={[GlobalStyles.inputContainer, styles.dateContainer]} onPress={() => setShowDatePicker(true)}>
                <Text style={GlobalStyles.normalTextBlack}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            {/* Assign User */}
            <View style={styles.userContainer}>
              <Text style={[GlobalStyles.normalText, styles.userLabel]}>Assign To</Text>
              <Pressable style={[GlobalStyles.inputContainer, styles.userInput]} onPress={() => setShowUserPicker(true)}>
                <Text style={GlobalStyles.normalTextBlack}>{assignedUser || "Select User"}</Text>
              </Pressable>
            </View>

            {/* Buttons */}
            <Pressable style={[GlobalStyles.primaryButton, styles.createButton]} onPress={handleAddTask}>
              <Text style={GlobalStyles.primaryButtonText}>Add Task</Text>
            </Pressable>

            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Date Picker Modal */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Select Due Date"
      />

      {/* User Picker Modal */}
      <UserPickerModal
  visible={showUserPicker}
  onClose={() => setShowUserPicker(false)}
  onUserSelected={(user) => setAssignedUser(user.id)} // ❌ Stores name instead of ID
  projectUsers={projectUsers}
/>
    </Modal>
  );
};

// ===== Updated Styles ===== //
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "75%",
    width: "90%",
    backgroundColor: "#15616D",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    padding: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  modalHeader: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  dueDateContainer: {
    width: "100%",
    marginTop: 10,
  },
  dueDateLabel: {
    paddingLeft: 3,
  },
  dateContainer: {
    justifyContent: "center",
  },
  userContainer: {
    width: "100%",
    marginTop: 10,
  },
  userLabel: {
    paddingLeft: 3,
  },
  userInput: {
    justifyContent: "center",
  },
  createButton: {
    marginTop: 20,
  },
  closeButton: {
    marginTop: 10,
    color: "#FFFFFF",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default AddTaskModal;