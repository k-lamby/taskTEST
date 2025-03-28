//================== CreateProjectModal.js ===========================//
// Self-contained modal component for creating new projects.
// Combines modal rendering, form inputs, and Firebase integration.
//====================================================================//

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import AddUserModal from "./AddUserModal";
import CustomDatePicker from "./CustomDatePicker";
import { useProjectService } from "../../services/projectService";
import { useUser } from "../../contexts/UserContext";

import GlobalStyles from "../../styles/styles";

const { height, width } = Dimensions.get("window");

/**
 * @component CreateProjectModal
 * @param {boolean} visible - Controls modal visibility.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onProjectCreated - Callback after project is created.
 */
const CreateProjectModal = ({ visible, onClose, onProjectCreated }) => {
  const { createProject } = useProjectService();
  const { userId } = useUser();

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [addedUsers, setAddedUsers] = useState([]);

  // Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  /**
   * Handles the creation of a new project and calls the callback.
   */
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert("Error", "Project name is required.");
      return;
    }

    try {
      const projectData = {
        name: projectName.trim(),
        description: projectDescription.trim(),
        dueDate: dueDate.toISOString(),
        createdBy: userId,
        sharedWith: addedUsers,
      };

      await createProject(projectData);

      if (typeof onProjectCreated === "function") {
        await onProjectCreated(); // Refresh parent screen
      }

      resetFormFields();
      onClose(); // Close modal
    } catch (error) {
      console.error("Error creating project:", error);
      Alert.alert("Error", "Could not create project. Please try again.");
    }
  };

  /**
   * Resets form fields after submission.
   */
  const resetFormFields = () => {
    setProjectName("");
    setProjectDescription("");
    setDueDate(new Date());
    setAddedUsers([]);
  };

  /**
   * Removes a user from the sharedWith list.
   * @param {number} index - Index of user to remove
   */
  const handleRemoveUser = (index) => {
    setAddedUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyles.headerText, styles.modalHeader]}>
              Create New Project
            </Text>

            {/* Project Name */}
            <TextInput
              style={[GlobalStyles.inputContainer, GlobalStyles.normalTextBlack]}
              placeholder="Project Name"
              placeholderTextColor="black"
              value={projectName}
              onChangeText={setProjectName}
              accessibilityLabel="Project name input"
              accessible={true}
            />

            {/* Project Description */}
            <TextInput
              style={[
                GlobalStyles.inputContainer,
                GlobalStyles.normalTextBlack,
                styles.descriptionInput,
              ]}
              placeholder="Project Description"
              placeholderTextColor="black"
              value={projectDescription}
              onChangeText={setProjectDescription}
              multiline={true}
              numberOfLines={6}
              accessibilityLabel="Project description input"
              accessible={true}
            />

            {/* Due Date */}
            <View style={styles.dueDateContainer}>
              <Text style={[GlobalStyles.normalText, styles.dueDateLabel]}>
                Due Date
              </Text>
              <Pressable
                style={[GlobalStyles.inputContainer, styles.dateContainer]}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel="Select due date"
                accessible={true}
              >
                <Text style={GlobalStyles.normalTextBlack}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            {/* Add Users */}
            <View style={styles.addedUsersContainer}>
              <Text style={GlobalStyles.subheaderText}>Added Users:</Text>
              <Pressable
                onPress={() => setShowUserModal(true)}
                style={styles.addUserIconContainer}
                accessibilityLabel="Add user to project"
                accessible={true}
              >
                <Icon name="user-plus" size={20} color="#fff" />
              </Pressable>
            </View>

            {/* User List */}
            <View style={styles.userList}>
              {addedUsers.length > 0 ? (
                addedUsers.map((user, index) => (
                  <View key={index} style={styles.userRow}>
                    <Text style={GlobalStyles.normalText}>{user}</Text>
                    <Pressable
                      onPress={() => handleRemoveUser(index)}
                      accessibilityLabel={`Remove user ${user}`}
                      accessible={true}
                    >
                      <Icon name="x" size={20} color="#FFA500" />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={GlobalStyles.translucentText}>No users added yet.</Text>
              )}
            </View>

            {/* Create Button */}
            <Pressable
              style={[GlobalStyles.primaryButton, styles.createButton]}
              onPress={handleCreateProject}
              accessibilityLabel="Create project"
              accessible={true}
            >
              <Text style={GlobalStyles.primaryButtonText}>Create</Text>
            </Pressable>

            {/* Close Button */}
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Custom Modals */}
      <AddUserModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserAdded={(newUser) => setAddedUsers((prevUsers) => [...prevUsers, newUser])}
      />

      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Due Date"
      />
    </Modal>
  );
};

//================== Styles ===========================//
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.8,
    width: width * 0.9,
    backgroundColor: "#15616D",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: "5%",
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
  addedUsersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  addUserIconContainer: {
    alignItems: "center",
  },
  userList: {
    width: "100%",
    marginTop: 5,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
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

export default CreateProjectModal;