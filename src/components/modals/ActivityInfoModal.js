//================== ActivityInfoModal.js ===========================//
// Reusable modal component to show activity information. This 
// opens up and displays messages and status changes.
//===================================================================//

import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import GlobalStyles from "../../styles/styles";

// Straight forward modal that just displays information about 
// the modal
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
      {/* tap outside the modal to close it */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={GlobalStyles.modal.overlay}>
          {/* prevent touch events dismissing modal area */}
          <TouchableWithoutFeedback>
            <View style={GlobalStyles.modal.container}>
              <View style={GlobalStyles.modal.content}>
                {/* title */}
                <Text
                  style={GlobalStyles.text.headerMd}
                  accessibilityRole="header"
                  accessibilityLabel="Activity information"
                >
                  Activity Info
                </Text>

                {/* activity content here */}
                <Text
                  style={[GlobalStyles.text.white, { marginTop: 10 }]}
                  accessibilityLabel={`Activity content: ${activity.content}`}
                >
                  {activity.content}
                </Text>

                {/* add in the timestamp */}
                <Text
                  style={[GlobalStyles.text.translucentSmall, { marginTop: 8 }]}
                  accessibilityLabel={`Activity date: ${activity.timestamp?.toDate?.().toLocaleString()}`}
                >
                  {activity.timestamp?.toDate?.().toLocaleString()}
                </Text>

                {/* close button only to dismiss the modal */}
                <Pressable
                  onPress={onClose}
                  style={[GlobalStyles.button.small, GlobalStyles.layout.seeMore]}
                  accessibilityRole="button"
                  accessibilityLabel="Close activity information modal"
                >
                  <Text style={GlobalStyles.text.closeButton}>Close</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActivityInfoModal;