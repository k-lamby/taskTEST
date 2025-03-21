//================ SignupScreen.js ========================//
// This is the entrance point into the application, using
// react navigation with stack the screens to be displayed
//========================================================//

import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Alert, ScrollView, KeyboardAvoidingView, 
  Platform, Keyboard, TouchableWithoutFeedback, StyleSheet
} from 'react-native';

import GlobalStyles from '../styles/styles';
import GradientBackground from "../components/GradientBackground"; 

import { signUp } from '../services/authService';
import { useUser } from "../contexts/UserContext";

const SignupScreen = ({ navigation }) => {
  // state variables for storing user sign up information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // context hook for passing current user settings through
  const { setUserId, setUserEmail, setFirstName: setUserFirstName } = useUser();

  // state variable to track validation errors
  const [errorMessage, setErrorMessage] = useState(null);

  // this handles the actual sign up
  const handleSignUp = async () => {
    // clear any previous error messages before handling new login
    setErrorMessage(null);

    // validate that the information is all present
    // if not, display an error to the user
    if (!firstName.trim()) {
      setErrorMessage("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage("Last name is required.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage("Valid email is required.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // use the sign up function in auth service
      const user = await signUp(email, password, firstName, lastName);

      // then on successful sign up, update the user context
      setUserId(user.uid);   
      setUserEmail(user.email);
      setUserFirstName(firstName);

      // then direct the user straight to the summary page
      navigation.navigate('Summary');

    } catch (error) {
      // display basic error handling for error on sign up
      // we should expand on this more for a future iteration
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <GradientBackground>
        {/* use keyboard avoiding view to prevent overlap between keyboard and form */}
        {/* https://reactnative.dev/docs/keyboardavoidingview */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.flexContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* clicking elsewhere on the page dismisses the keyboard */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.container}>
                <View style={styles.logoContainer}>
                  <Text style={[GlobalStyles.logoText, styles.logoText]}>task</Text>
                  <Text style={[GlobalStyles.logoText, styles.logoText]}>HIVE</Text>
                </View>

                {/* input for signing up to the application */}
                <View style={styles.formContainer}>

                  {/* conditional display of error messages */}
                  {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                  {/* Input Fields with Spacing */}
                  <TextInput 
                    style={styles.input} 
                    placeholder="First Name" 
                    placeholderTextColor="#ffffff" 
                    value={firstName}
                    onChangeText={setFirstName}
                    accessibilityLabel="Enter your first name"
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Last Name" 
                    placeholderTextColor="#ffffff" 
                    value={lastName}
                    onChangeText={setLastName}
                    accessibilityLabel="Enter your last name"
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    placeholderTextColor="#ffffff" 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Enter your email"
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Password" 
                    placeholderTextColor="#ffffff" 
                    secureTextEntry 
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    accessibilityLabel="Enter your password"
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Confirm Password" 
                    placeholderTextColor="#ffffff" 
                    secureTextEntry 
                    textContentType="password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    accessibilityLabel="Re-enter your password"
                  />

                  {/* when pressed triggers the handle sign up function */}
                  <TouchableOpacity 
                    style={GlobalStyles.primaryButton} 
                    onPress={handleSignUp}
                    accessibilityLabel="Sign up for a new account"
                  >
                    <Text style={GlobalStyles.primaryButtonText}>Sign Up</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Go back to login screen"
                  >
                    <Text style={GlobalStyles.closeButtonText}>Back to Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
    </GradientBackground>
  );
};

// ==== Page Specific Styles===//
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    ...GlobalStyles.textInput,
    marginBottom: 12,
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 10,
    fontSize: 14,
  },
});

export default SignupScreen;