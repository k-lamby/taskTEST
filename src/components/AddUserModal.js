//=============AddUserModal.js=================//
// pop up modal for adding a user via their email
// address
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
} from 'react-native';

import GlobalStyles from '../styles/styles';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  // state for storing the user email that has been added
  const [userEmail, setUserEmail] = useState('');

  // minimal validating for now
  // but just check an email has been added
  const handleAddUser = () => {
    if (!userEmail.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }

    // callback function passing the user email
    onUserAdded(userEmail.trim());
    //reset the user email to blank
    setUserEmail('');
    onClose();
  };

  // display the modal, simple text input with an add user or close button
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={[GlobalStyles.headerText, styles.headerSpace]}>Add User</Text>
            
            <TextInput
              style={GlobalStyles.inputContainer}
              placeholder="Enter User Email"
              value={userEmail}
              onChangeText={setUserEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <View style={styles.buttonContainer}>
              <Pressable style={GlobalStyles.primaryButton} onPress={handleAddUser}>
                <Text style={GlobalStyles.primaryButtonText}>Add User</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text style={styles.closeButton}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ===== Updated Styles ===== //
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#001524',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  headerSpace: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    gap: 10, 
  },
  closeButton: {
    marginTop: 10,
    color: "#FFFFFF",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default AddUserModal;