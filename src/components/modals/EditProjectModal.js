//================== EditProjectModal.js ===========================//
// Modal to edit an existing project's name and description.
// Uses GlobalStyles for consistent styling and accessibility.
//==================================================================//

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
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateProject } = useProjectService();

  // Populate fields when modal opens
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || "");
    }
  }, [project, visible]);

  const handleUpdateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert("Validation Error", "Project name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await updateProject(project.id, {
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      onClose();
    } catch (error) {
      console.error("❌ Error updating project:", error);
      Alert.alert("Update Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.overlay}>
          <View style={GlobalStyles.modal.container}>
            {/* 📝 Modal Title */}
            <Text style={[GlobalStyles.text.headerMd, styles.modalHeader]}>
              Edit Project
            </Text>

            {/* 🧾 Project Name Input */}
            <TextInput
              style={GlobalStyles.input.field}
              placeholder="Project Name"
              placeholderTextColor="#555"
              value={projectName}
              onChangeText={setProjectName}
              accessibilityLabel="Project Name Input"
              autoFocus
            />

            {/* 🧾 Project Description Input */}
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

            {/* ✅ Update Button */}
            <TouchableOpacity
              style={GlobalStyles.button.primary}
              onPress={handleUpdateProject}
              disabled={loading}
              accessibilityLabel="Update Project Button"
            >
              <Text style={GlobalStyles.button.text}>
                {loading ? "Updating..." : "Update Project"}
              </Text>
            </TouchableOpacity>

            {/* ❌ Cancel Button */}
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