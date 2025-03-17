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
  const [userEmail, setUserEmail] = useState('');

  const handleAddUser = () => {
    if (!userEmail.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address.');
      return;
    }

    console.log('Adding user:', userEmail);

    onUserAdded(userEmail.trim());
    setUserEmail('');
    onClose();
  };

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

            {/* Button Container (Stacked Vertically) */}
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
    flexDirection: 'column', // ✅ Stacks buttons vertically
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    gap: 10, // Adds spacing between the buttons
  },
  closeButton: {
    marginTop: 10,
    color: "#FFFFFF",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default AddUserModal;