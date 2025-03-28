import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";

import CustomDatePicker from "./CustomDatePicker";
import UserPickerModal from "./UserPickerModal";
import GlobalStyles from "../../styles/styles";
import { useUser } from "../../contexts/UserContext";
import { addTask } from "../../services/taskService";

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
      alert("Task name is required!");
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

      // Reset fields
      setTaskName("");
      setTaskDescription("");
      setDueDate(new Date());
      setAssignedUser({ id: userId, name: firstName });
      setPriority("medium");

      onTaskAdded();
      onClose();
    } catch (error) {
      alert("Failed to add task. Please try again.");
      console.error("Add Task Error:", error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.bottomOverlay}>
          <View style={GlobalStyles.modal.bottomContainer}>
            {/* 📝 Header */}
            <Text
              style={[GlobalStyles.text.headerMd, { marginBottom: 20 }]}
              accessibilityLabel="Add Task Modal Header"
            >
              Add Task
            </Text>

            {/* 🏷️ Task Name */}
            <TextInput
              style={GlobalStyles.input.field}
              placeholder="Task Name"
              placeholderTextColor="#333"
              value={taskName}
              onChangeText={setTaskName}
              accessibilityLabel="Task name input"
            />

            {/* 📝 Task Description */}
            <TextInput
              style={[GlobalStyles.input.field, GlobalStyles.input.multiline, { height: 100 }]}
              placeholder="Task Description"
              placeholderTextColor="#333"
              multiline
              numberOfLines={4}
              value={taskDescription}
              onChangeText={setTaskDescription}
              accessibilityLabel="Task description input"
            />

            {/* 📅 Due Date */}
            <Text style={[GlobalStyles.text.white, GlobalStyles.input.label]}>
              Due Date
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={GlobalStyles.input.container}
              accessibilityLabel="Select due date"
            >
              <Text style={GlobalStyles.text.black}>
                {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
              </Text>
            </Pressable>

            {/* 👤 Assigned User */}
            <Text style={[GlobalStyles.text.white, GlobalStyles.input.label]}>
              Assign To
            </Text>
            <Pressable
              onPress={() => setShowUserPicker(true)}
              style={GlobalStyles.input.container}
              accessibilityLabel="Select user to assign task"
            >
              <Text style={GlobalStyles.text.black}>
                {assignedUser?.name || "Select User"}
              </Text>
            </Pressable>

            {/* 🚦 Priority Buttons */}
            <Text style={[GlobalStyles.text.white, GlobalStyles.input.label]}>
              Priority
            </Text>
            <View style={GlobalStyles.priority.optionsRow}>
              {["low", "medium", "high"].map((level) => {
                const isSelected = priority === level;
                const buttonStyle = [
                  GlobalStyles.priority.base,
                  GlobalStyles.priority[level],
                  isSelected && { opacity: 1 },
                  !isSelected && { opacity: 0.5 },
                ];

                return (
                  <Pressable
                    key={level}
                    onPress={() => setPriority(level)}
                    accessibilityLabel={`Set priority to ${level}`}
                    style={buttonStyle}
                  >
                    <Text style={GlobalStyles.priority.text}>{level}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* ✅ Add Task Button */}
            <Pressable
              onPress={handleAddTask}
              style={GlobalStyles.button.primary}
              accessibilityLabel="Add task"
            >
              <Text style={GlobalStyles.button.text}>Add Task</Text>
            </Pressable>

            {/* ❌ Close Modal */}
            <Pressable onPress={onClose} accessibilityLabel="Close add task modal">
              <Text style={GlobalStyles.text.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* 📅 Date Picker Modal */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Select Due Date"
      />

      {/* 👤 User Picker Modal */}
      <UserPickerModal
        visible={showUserPicker}
        onClose={() => setShowUserPicker(false)}
        onUserSelected={(user) => setAssignedUser(user)}
        projectUsers={projectUsers}
      />
    </Modal>
  );
};

export default AddTaskModal;