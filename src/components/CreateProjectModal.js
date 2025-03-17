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
import useProjectService from "../services/projectService"; // ✅ Corrected Import
import { useUser } from "../contexts/UserContext"; // ✅ Ensure correct context import

import GlobalStyles from "../styles/styles";

const { height, width } = Dimensions.get("window");

const CreateProjectForm = ({ visible, onClose }) => {
  const { createProject } = useProjectService(); // ✅ Correct Hook Usage
  const { userId } = useUser(); // ✅ Ensure userId is available

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [addedUsers, setAddedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      resetFormFields();
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
      Alert.alert("Error", "Could not create project. Please try again.");
    }
  };

  const resetFormFields = () => {
    setProjectName("");
    setProjectDescription("");
    setDueDate(new Date());
    setAddedUsers([]);
  };

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
            />

            {/* Project Description (Double Height) */}
            <TextInput
              style={[
                GlobalStyles.inputContainer,
                GlobalStyles.normalTextBlack,
                styles.descriptionInput, // ✅ Increased height
              ]}
              placeholder="Project Description"
              placeholderTextColor="black"
              multiline={true}
              numberOfLines={6} // ✅ Increased number of lines
              value={projectDescription}
              onChangeText={setProjectDescription}
            />

            {/* Due Date (Indented by 3 Points) */}
            <View style={styles.dueDateContainer}>
              <Text style={[GlobalStyles.normalText, styles.dueDateLabel]}>Due Date</Text>
              <Pressable
                style={[GlobalStyles.inputContainer, styles.dateContainer]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={GlobalStyles.normalTextBlack}>
                  {`${dueDate.getDate()}/${
                    dueDate.getMonth() + 1
                  }/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            </View>

            {/* Added Users Section (Icons Now Vertically Aligned) */}
            <View style={styles.addedUsersContainer}>
              <Text style={GlobalStyles.subheaderText}>Added Users:</Text>
              <Pressable onPress={() => setShowUserModal(true)} style={styles.addUserIconContainer}>
                <Icon name="user-plus" size={20} color="#fff" />
              </Pressable>
            </View>

            {/* Added Users List (Icons Now Vertically Aligned) */}
            <View style={styles.userList}>
              {addedUsers.length > 0 ? (
                addedUsers.map((user, index) => (
                  <View key={index} style={styles.userRow}>
                    <Text style={GlobalStyles.normalText}>{user}</Text>
                    <Pressable onPress={() => handleRemoveUser(index)}>
                      <Icon name="x" size={20} color="#FFA500" />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={GlobalStyles.translucentText}>
                  No users added yet.
                </Text>
              )}
            </View>

            {/* Buttons (Create & Close) */}
            <Pressable
              style={[GlobalStyles.primaryButton, styles.createButton]}
              onPress={handleCreateProject}
            >
              <Text style={GlobalStyles.primaryButtonText}>Create</Text>
            </Pressable>

            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Add User Modal */}
      <AddUserModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserAdded={(newUser) => setAddedUsers((prevUsers) => [...prevUsers, newUser])}
      />

      {/* Date Picker */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Due Date"
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
    height: 120, // ✅ Double height
    textAlignVertical: "top",
  },
  dueDateContainer: {
    width: "100%",
    marginTop: 10,
  },
  dueDateLabel: {
    paddingLeft: 3, // Indented by 3 points
  },
  dateContainer: {
    justifyContent: "center",
  },
  addedUsersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // ✅ Ensures vertical alignment
    width: "100%",
    marginTop: 10,
  },
  addUserIconContainer: {
    alignItems: "center", // ✅ Ensures icon is vertically aligned
  },
  userList: {
    width: "100%",
    marginTop: 5,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // ✅ Ensures text and "X" icon align
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

export default CreateProjectForm;