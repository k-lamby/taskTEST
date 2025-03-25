//================== EditProjectModal.js ===========================//
// Modal to edit an existing project's name and description.
// Integrates clearly with projectService to persist changes.
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
import { useProjectService } from "../services/projectService";
import GlobalStyles from "../styles/styles";

const EditProjectModal = ({ visible, onClose, project }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateProject } = useProjectService();

  // Populate fields with project data when modal opens
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || "");
    }
  }, [project, visible]);

  // Handle updating project details
  const handleUpdateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert("Validation Error", "Project name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await updateProject(project.id, {
        name: projectName,
        description: projectDescription,
      });
      onClose(); // Close modal after success
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
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit Project</Text>

            {/* Project Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Project Name"
              placeholderTextColor="#888"
              value={projectName}
              onChangeText={setProjectName}
              accessibilityLabel="Project Name Input"
            />

            {/* Project Description Input */}
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Project Description"
              placeholderTextColor="#888"
              value={projectDescription}
              multiline
              numberOfLines={4}
              onChangeText={setProjectDescription}
              accessibilityLabel="Project Description Input"
            />

            {/* Update Button */}
            <TouchableOpacity
              style={GlobalStyles.primaryButton}
              onPress={handleUpdateProject}
              disabled={loading}
              accessibilityLabel="Update Project Button"
            >
              <Text style={GlobalStyles.primaryButtonText}>
                {loading ? "Updating..." : "Update Project"}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity onPress={onClose} accessibilityLabel="Cancel Edit Button">
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Component-specific styles clearly defined
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#15616D",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 8,
    color: "#000",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  closeButton: {
    marginTop: 12,
    color: "#15616D",
    textDecorationLine: "underline",
  },
});

export default EditProjectModal;