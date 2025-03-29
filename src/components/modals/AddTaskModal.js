//================== AddTaskModal.js ===========================//
// Modal for adding a task, slides up from the bottom and looks
// similar to the create project modal
//==============================================================//
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

// modal allows you to set a name, description, due date, assign it to a user
// and set the priority flag
const AddTaskModal = ({ visible, onClose, onTaskAdded, projectId, projectUsers }) => {
  // user context, used for assigning the task initially
  const { userId, firstName } = useUser();
  // various states for storing for the form details
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("medium");
  const [assignedUser, setAssignedUser] = useState({ id: userId, name: firstName });
  // states for setting whether the modals are visible or not
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);

  // function for handling adding a task
  const handleAddTask = async () => {
    // check to make sure a task name is set
    // other required data is forced by the form
    if (!taskName.trim()) {
      Alert.alert("Task name is required!");
      return;
    }
    try {
      // then call add task from the taskService
      await addTask({
        name: taskName,
        description: taskDescription,
        projectId,
        owner: assignedUser.id,
        dueDate,
        status: "pending",
        priority,
      });
      // reset the fields back to empty
      setTaskName("");
      setTaskDescription("");
      setDueDate(new Date());
      setAssignedUser({ id: userId, name: firstName });
      setPriority("medium");
      // callback on task added, to trigger refresh of the page
      onTaskAdded();
      onClose();
    } catch (error) {
      // basic error handling for now
      Alert.alert("Failed to add task. Please try again.");
      console.error("Add Task Error:", error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.bottomOverlay}>
          <View style={GlobalStyles.modal.bottomContainer}>
            {/* Header including accessibility labels */}
            <Text
              style={[GlobalStyles.text.headerMd, { marginBottom: 20 }]}
              accessibilityLabel="Add Task Modal Header">
              Add Task
            </Text>

            {/* Form inputs for the user to enter the details */}
            <TextInput
              style={GlobalStyles.input.field}
              placeholder="Task Name"
              placeholderTextColor="#333"
              value={taskName}
              onChangeText={setTaskName}
              accessibilityLabel="Task name input"
            />
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

            {/* Due Date, clicking on it will display the datepicker */}
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

            {/* Assigned user clicking open the user picker modal*/}
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

            {/* logic to handle the priority buttons small inline js 
            to pick the colour and whether or not the button is active */}
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

            {/* add Task Button */}
            <Pressable
              onPress={handleAddTask}
              style={GlobalStyles.button.primary}
              accessibilityLabel="Add task"
            >
              <Text style={GlobalStyles.button.text}>Add Task</Text>
            </Pressable>

            {/* close modal, consistent with app styles */}
            <Pressable onPress={onClose} accessibilityLabel="Close add task modal">
              <Text style={GlobalStyles.text.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* date picker modal */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Select Due Date"
      />

      {/* user picker modal, passing it the project users
      for selection from */}
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