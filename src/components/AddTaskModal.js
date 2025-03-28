import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";

import CustomDatePicker from "./CustomDatePicker";
import UserPickerModal from "./UserPickerModal";
import GlobalStyles from "../styles/styles";
import { useUser } from "../contexts/UserContext";
import { addTask } from "../services/taskService";

const AddTaskModal = ({ visible, onClose, onTaskAdded, projectId, projectUsers }) => {
  const { userId, firstName } = useUser();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("medium");
  const [assignedUser, setAssignedUser] = useState({ id: userId, name: firstName });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Task name is required!");
      return;
    }

    try {
      await addTask({
        name: taskName,
        description: taskDescription,
        projectId,
        owner: assignedUser.id,
        dueDate,
        status: "pending",
        priority,
      });

      setTaskName("");
      setTaskDescription("");
      setDueDate(new Date());
      setAssignedUser({ id: userId, name: firstName });
      setPriority("medium");
      onTaskAdded();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to add task. Please try again.");
      console.error("Add Task Error:", error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modalOverlayBottom}>
          <View style={GlobalStyles.bottomSlideUpModalContainer}>
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>Add Task</Text>

            {/* Task Name */}
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack]}
              placeholder="Task Name"
              placeholderTextColor="black"
              value={taskName}
              onChangeText={setTaskName}
              accessibilityLabel="Task name input field"
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
              accessibilityLabel="Task description input field"
            />

            {/* Due Date */}
            <Text style={[GlobalStyles.normalText, GlobalStyles.label]}>Due Date</Text>
            <View style={GlobalStyles.inputContainer}>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel="Select due date"
              >
                <Text style={GlobalStyles.normalTextBlack}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            {/* Assign To */}
            <Text style={[GlobalStyles.normalText, GlobalStyles.label]}>Assign To</Text>
            <View style={GlobalStyles.inputContainer}>
              <Pressable
                onPress={() => setShowUserPicker(true)}
                accessibilityLabel="Select user to assign task"
              >
                <Text style={GlobalStyles.normalTextBlack}>
                  {assignedUser?.name || "Select User"}
                </Text>
              </Pressable>
            </View>

            {/* Priority */}
            <View style={GlobalStyles.priorityOptions}>
              {["low", "medium", "high"].map((level) => {
                const isSelected = level === priority;
                const selectedStyle =
                  level === "low"
                    ? GlobalStyles.priorityButtonSelectedLow
                    : level === "medium"
                    ? GlobalStyles.priorityButtonSelectedMedium
                    : GlobalStyles.priorityButtonSelectedHigh;

                return (
                  <Pressable
                    key={level}
                    onPress={() => setPriority(level)}
                    style={[
                      GlobalStyles.priorityButton,
                      isSelected && selectedStyle,
                    ]}
                    accessibilityLabel={`Set priority to ${level}`}
                  >
                    <Text style={GlobalStyles.priorityButtonText}>{level}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Add Task */}
            <Pressable
              style={[GlobalStyles.primaryButton, styles.createButton]}
              onPress={handleAddTask}
              accessibilityLabel="Create task"
            >
              <Text style={GlobalStyles.primaryButtonText}>Add Task</Text>
            </Pressable>

            <Pressable onPress={onClose} accessibilityLabel="Close add task modal">
              <Text style={GlobalStyles.closeButtonText}>Close</Text>
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
        onUserSelected={(user) => setAssignedUser(user)}
        projectUsers={projectUsers}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  createButton: {
    marginTop: 20,
  },
});

export default AddTaskModal;