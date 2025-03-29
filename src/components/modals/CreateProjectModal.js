//================== CreateProjectModal.js ===========================//
// Slides up from the bottom, allows the user to create a project 
// and add users to it
//===================================================================//
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
} from "react-native";
import { UserPlus, X } from "lucide-react-native";

import AddUserModal from "./AddUserModal";
import CustomDatePicker from "./CustomDatePicker";
import { useProjectService } from "../../services/projectService";
import { useUser } from "../../contexts/UserContext";

import GlobalStyles from "../../styles/styles";

// create project modal, has a call back that is used to refresh
// the project details on the main screen
const CreateProjectModal = ({ visible, onClose, onProjectCreated }) => {
  const { createProject } = useProjectService();
  const { userId } = useUser();
  // states for handling the form inputs
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [addedUsers, setAddedUsers] = useState([]);
  // states for handling the visibility of the modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // check to make sure a project name is passed
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert("Error", "Project name is required.");
      return;
    }
    try {
      // create the project object for upload to the database
      const projectData = {
        name: projectName.trim(),
        description: projectDescription.trim(),
        dueDate: dueDate.toISOString(),
        createdBy: userId,
        sharedWith: addedUsers,
      };

      // then create the project
      await createProject(projectData);
      // pass the callback using optional chaining
      onProjectCreated?.();
      resetFormFields();
      onClose();
    } catch (error) {
      // display the error if the project cannot be created
      Alert.alert("Error", "Could not create project. Please try again.");
    }
  };
  // then reset the form fields so when it is reopened the data doesnt
  // persist.
  const resetFormFields = () => {
    setProjectName("");
    setProjectDescription("");
    setDueDate(new Date());
    setAddedUsers([]);
  };
  // function to handle remove users as they are added
  const handleRemoveUser = (index) => {
    // set the state using a function that filters the previous state
    // to remove the user at that index
    setAddedUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.bottomOverlay}>
          <View style={GlobalStyles.modal.bottomContainer}>
            <Text style={GlobalStyles.text.headerLg}>Create New Project</Text>

            {/* Form inputs */}
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="Project Name"
                placeholderTextColor="#000"
                value={projectName}
                onChangeText={setProjectName}
                accessibilityLabel="Enter project name"
              />
              <TextInput
                style={[GlobalStyles.input.field, GlobalStyles.input.multiline]}
                placeholder="Project Description"
                placeholderTextColor="#000"
                value={projectDescription}
                onChangeText={setProjectDescription}
                multiline
                numberOfLines={5}
                accessibilityLabel="Enter project description"
              />
              <Text style={[GlobalStyles.text.white, GlobalStyles.input.label]}>
                Due Date
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={GlobalStyles.input.field}
                accessibilityLabel="Select due date"
              >
                <Text style={GlobalStyles.text.black}>
                  {`${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`}
                </Text>
              </Pressable>
            <View style={[GlobalStyles.utility.clickableRow, { justifyContent: "space-between" }]}>
              <Text style={GlobalStyles.text.white}>Added Users</Text>
              <Pressable
                onPress={() => setShowUserModal(true)}
                style={GlobalStyles.button.small}
                accessibilityLabel="Add user to project"
              >
                <UserPlus color="#fff" size={20} />
              </Pressable>
            </View>
            {/* this shows the users being added to the project as the user
            adds them. Shows a small cross which allows the user to remove them as well */}
            <View style={{ width: "100%", marginTop: 5 }}>
              {addedUsers.length > 0 ? (
                addedUsers.map((user, index) => (
                  <View
                    key={index}
                    style={[
                      GlobalStyles.utility.clickableRow,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <Text style={GlobalStyles.text.white}>{user}</Text>
                    <Pressable
                      onPress={() => handleRemoveUser(index)}
                      accessibilityLabel={`Remove user ${user}`}
                    >
                      <X size={20} color="#FFA500" />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={GlobalStyles.text.translucent}>
                  No users added yet.
                </Text>
              )}
            </View>
            <Pressable
              style={GlobalStyles.button.primary}
              onPress={handleCreateProject}
              accessibilityLabel="Create project"
            >
              <Text style={GlobalStyles.button.text}>Create</Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={GlobalStyles.text.closeButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* add user modal, for adding new users by their email*/}
      <AddUserModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserAdded={(newUser) =>
          setAddedUsers((prevUsers) => [...prevUsers, newUser])
        }
      />
      {/* custom date picker modal */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateChange={setDueDate}
        title="Due Date"
      />
    </Modal>
  );
};

export default CreateProjectModal;