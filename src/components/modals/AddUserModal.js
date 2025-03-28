//============= AddUserModal.js =============//
// Modal for adding a user to a project by email.
// Uses centralized GlobalStyles for consistency.
//===========================================//

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

import GlobalStyles from '../../styles/styles';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  const [userEmail, setUserEmail] = useState('');

  const handleAddUser = () => {
    if (!userEmail.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }

    onUserAdded(userEmail.trim());
    setUserEmail('');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.overlay}>
          <View style={GlobalStyles.modal.container}>
            {/* 🧑‍🤝‍🧑 Header */}
            <Text style={[GlobalStyles.text.headerMd, styles.headerSpacing]}>
              Add User
            </Text>

            {/* 📧 Email Input */}
            <TextInput
              style={GlobalStyles.input.field}
              placeholder="Enter user email"
              placeholderTextColor="#555"
              value={userEmail}
              onChangeText={setUserEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              accessibilityLabel="Email address input"
            />

            {/* 🔘 Action Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={GlobalStyles.button.primary}
                onPress={handleAddUser}
                accessibilityLabel="Confirm add user"
              >
                <Text style={GlobalStyles.button.text}>Add User</Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                accessibilityLabel="Close add user modal"
              >
                <Text style={GlobalStyles.text.closeButton}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddUserModal;

// ================= Local Styles ================= //
const styles = StyleSheet.create({
  headerSpacing: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
});