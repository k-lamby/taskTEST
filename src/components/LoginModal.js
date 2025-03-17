//================== LonginModal.js ===========================//
// The modal is a pop up to log the user in, simple form
// requesting username and password. Uses the auth service
// for validation, and updates the user context
//========================================================//
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';

import { logIn } from '../services/authService';
import { useUser } from '../contexts/UserContext';

import GlobalStyles from '../styles/styles';

const LoginModal = ({ visible, onClose, navigation }) => {
  // Set up states for capturing login details
  const usernameInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId, setUserEmail, setFirstName } = useUser();

  useEffect(() => {
    if (visible) {
      // when first opening the modal, we auto focus on the email
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // functionality to handle the login
  const handleLogin = async () => {
    // try catch to authenticate the user
    try {
      // log the user in using the login details
      const user = await logIn(email, password);
      // then set the user details, these will be used throughout the app
      setUserId(user.uid);
      setUserEmail(user.email);

      // grab the first name from the associated user account
      const firstName = user.displayName.split(" ")[0];
      setFirstName(firstName);

      onClose();
      // on successful login we navigate to the summary page
      navigation.navigate('Summary');
    } catch (error) {
      // otherwise if there is an error display the message
      // to the user
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={1} 
        onPressOut={onClose}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={GlobalStyles.headerText}>Login</Text>
            
            <TextInput 
              ref={usernameInputRef}
              style={GlobalStyles.textInput} 
              placeholder="Email" 
              placeholderTextColor="rgba(255, 255, 255, 0.7)" 
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email input"
              accessibilityHint="Enter your email"
            />
            
            <View style={styles.inputSpacing} />

            <TextInput 
              style={GlobalStyles.textInput} 
              placeholder="Password" 
              placeholderTextColor="rgba(255, 255, 255, 0.7)" 
              secureTextEntry 
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
            />
            
            <TouchableOpacity 
              style={GlobalStyles.primaryButton} 
              onPress={handleLogin}
              accessibilityLabel="Login button"
              accessibilityHint="Tap to log in"
            >
              <Text style={GlobalStyles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onClose}
              accessibilityLabel="Close button"
              accessibilityHint="Tap to close the login modal"
            >
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    paddingTop: '45%',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#001524',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  inputSpacing: {
    height: 15,
  },
  closeButton: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginModal;