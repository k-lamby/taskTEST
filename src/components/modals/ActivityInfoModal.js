//================== ActivityInfoModal.js ===========================//
// Reusable modal component to show activity information.
//===================================================================//

import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  AccessibilityInfo,
} from "react-native";
import GlobalStyles from "../../styles/styles";

/**
 * ActivityInfoModal
 * Props:
 * - visible: Boolean to show/hide modal
 * - onClose: Function to close modal
 * - activity: Object with { content, timestamp, type }
 */
const ActivityInfoModal = ({ visible, onClose, activity }) => {
  if (!activity) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={GlobalStyles.sectionTitle}>Activity Info</Text>

              <Text
                style={[GlobalStyles.normalText, { marginTop: 10 }]}
                accessibilityLabel={`Activity content: ${activity.content}`}
              >
                {activity.content}
              </Text>

              <Text
                style={styles.timestampText}
                accessibilityLabel={`Activity date: ${activity.timestamp?.toDate?.().toLocaleString()}`}
              >
                {activity.timestamp?.toDate?.().toLocaleString()}
              </Text>

              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close activity information modal"
                style={styles.closeButton}
              >
                <Text style={GlobalStyles.seeMoreText}>Close</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActivityInfoModal;

// ================== Local Styles ================== //
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
});