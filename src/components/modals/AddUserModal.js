//================== AddUserModal.js ===========================//
// Simple modal that allows for the input of a user email address
//==============================================================//

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
  // state for getting the form information
  const [userEmail, setUserEmail] = useState('');
  //check to make sure there is something being passed from the form
  const handleAddUser = () => {
    if (!userEmail.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }
    //callback passing the email
    onUserAdded(userEmail.trim());
    // then reset the form state and close
    setUserEmail('');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={GlobalStyles.modal.overlay}>
          <View style={GlobalStyles.modal.container}>
            <Text style={[GlobalStyles.text.headerMd, styles.headerSpacing]}>
              Add User
            </Text>

            {/* Email input, use os shortcuts to bring up the email address keyboard etc */}
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

// =======Page Specific Styles ========= //
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