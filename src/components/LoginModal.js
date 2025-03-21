//================== LoginModal.js ===========================//
// The modal is a pop up to log the user in, simple form
// requesting username and password. Uses the auth service
// for validation, and updates the user context
//========================================================//

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { logIn } from "../services/authService";
import { useUser } from "../contexts/UserContext";

import GlobalStyles from "../styles/styles";

const LoginModal = ({ visible, onClose, navigation }) => {
  // states for handling the various form inputs
  const usernameInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // context hook for passing current user settings through
  const { setUserId, setUserEmail, setFirstName } = useUser();

  // wait a moment, and then make sure the user name is focused
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // handle the login, we try to authenticate,
  // set the user context details for use throughout the app
  const handleLogin = async () => {
    try {
      const user = await logIn(email, password);

      // Update global user context with authenticated user details
      // while authentication automatically updates these, it does it
      // asyncronously, so we force the issue here
      setUserId(user.uid);
      setUserEmail(user.email);

      //https://medium.com/bsadd/optional-chaining-in-react-native-805a374788d3
      const firstName = user.displayName ? user.displayName.split(" ")[0] : "User";
      setFirstName(firstName);

      // Close the modal and navigate to the summary screen
      onClose();
      navigation.navigate("Summary");
    } catch (error) {
      // Display error message if authentication fails
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
      {/** When we press outside the modal, it dismisses the keyboard
       * but doesnt actually close the modal itsel */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={GlobalStyles.modalOverlay}>
          <View style={GlobalStyles.modalContainer}>
            <KeyboardAvoidingView
              style={GlobalStyles.modalContent}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Text style={GlobalStyles.headerText}>Login</Text>

              <TextInput
                ref={usernameInputRef}
                style={GlobalStyles.textInput}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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
                textContentType="password"
                accessibilityRole="text"
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
                <Text style={GlobalStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// =================Page Specific Styles============== //

const styles = {
  inputSpacing: {
    height: 15, 
  },
};

export default LoginModal;