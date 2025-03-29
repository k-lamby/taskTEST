//================== EditProjectModal.js =======================//
// straight forward modal that allows the user to edit the name
// and description of an existing project.
//==============================================================//

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Alert,
} from "react-native";
import { useProjectService } from "../../services/projectService";
import GlobalStyles from "../../styles/styles";

const EditProjectModal = ({ visible, onClose, project }) => {
  // states for storing the form entries
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  const { updateProject } = useProjectService();

  // when the modal opens, prefill the fields of the form
  // with the current data
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || "");
    }
  }, [project, visible]);

  //function for handling updating the project
  const handleUpdateProject = async () => {
    // check to make sure a project name is given
    if (!projectName.trim()) {
      Alert.alert("Validation Error", "Project name cannot be empty.");
      return;
    }
    try {
      // then wait for the update of the project
      await updateProject(project.id, {
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      // on update close the modal
      onClose();
    } catch (error) {
      Alert.alert("Update Failed", "Please try again.");
    } 
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.overlay}>
          <View style={GlobalStyles.modal.container}>
            <Text style={[GlobalStyles.text.headerMd, styles.modalHeader]}>
              Edit Project
            </Text>
            {/* form inputs */}
            <TextInput
              style={GlobalStyles.input.field}
              placeholder="Project Name"
              placeholderTextColor="#555"
              value={projectName}
              onChangeText={setProjectName}
              accessibilityLabel="Project Name Input"
              autoFocus
            />
            <TextInput
              style={[GlobalStyles.input.field, GlobalStyles.input.multiline]}
              placeholder="Project Description"
              placeholderTextColor="#555"
              value={projectDescription}
              onChangeText={setProjectDescription}
              multiline
              numberOfLines={4}
              accessibilityLabel="Project Description Input"
            />
            <TouchableOpacity
              style={GlobalStyles.button.primary}
              onPress={handleUpdateProject}
              accessibilityLabel="Update Project Button"
            >
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Cancel Edit Button"
            >
              <Text style={GlobalStyles.text.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditProjectModal;

// ========== Local Styles (Minimal) ==========
const styles = StyleSheet.create({
  modalHeader: {
    marginBottom: 20,
  },
});