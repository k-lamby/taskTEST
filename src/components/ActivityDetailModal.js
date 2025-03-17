//================== Activity Detail Modal.js ===========================//
// This will display all the activities that have occured that are associated
// with the task.
//====================================================================//
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import GlobalStyles from "../styles/styles";

// takes the activity details being passed to it
// whether the modal is visible or not, and the action on close
const ActivityDetailModal = ({ activity, visible, onClose }) => {
  if (!activity) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{activity.type}</Text>
          <Text style={styles.label}>Uploaded By: {activity.uploadedBy}</Text>
          <Text style={styles.label}>Date: {new Date(activity.timestamp).toLocaleString()}</Text>
          {/* If there is a description associated with the activity then display that */}
          {activity.description ? (
            <Text style={styles.modalText}>{activity.description}</Text>
          ) : (
            <Text style={styles.placeholderText}>No description provided.</Text>
          )}
          <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={onClose}>
            <Text style={GlobalStyles.secondaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===== Page specific styles ===== //
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#001524",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalText: {
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    marginTop: 10,
  },
  label: {
    color: "#FFA500",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ActivityDetailModal;