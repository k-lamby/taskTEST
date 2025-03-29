//================ SignupScreen.js ========================//
// This screen allows new users to register with email, name, and password.
// It handles validation, keyboard avoidance, and navigation.
//========================================================//

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';

import GlobalStyles from '../styles/styles';
import GradientBackground from '../components/GradientBackground';

import { signUp } from '../services/authService';
import { useUser } from '../contexts/UserContext';

const SignupScreen = ({ navigation }) => {
  // states for storing the form information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // use the user context so the information is passed around the app
  const { setUserId, setUserEmail, setFirstName: setUserFirstName } = useUser();

  const handleSignUp = async () => {
    //reset the error message
    setErrorMessage(null);
    // validate the form inputs to make sure 
    if (!firstName.trim()) return setErrorMessage("First name is required.");
    if (!lastName.trim()) return setErrorMessage("Last name is required.");
    if (!email.trim() || !email.includes('@')) return setErrorMessage("Valid email is required.");
    if (password.length < 6) return setErrorMessage("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setErrorMessage("Passwords do not match.");
    try {
      // sign the user up using the authservice handles
      const user = await signUp(email, password, firstName, lastName);
      // set the user info on success
      setUserId(user.uid);
      setUserEmail(user.email);
      setUserFirstName(firstName);
      // and then push the user to the summary page
      navigation.navigate('Summary');
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={GlobalStyles.container.base}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={GlobalStyles.container.centeredFullScreen}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={GlobalStyles.container.form}>
              
              {/* logo, with app title stacked */}
              <View style={styles.logoRow}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={GlobalStyles.logo.smallImage}
                  resizeMode="cover"
                  accessibilityLabel="taskHIVE logo"
                />
                <View style={styles.textColumn}>
                  <Text style={GlobalStyles.logo.textSmall}>task</Text>
                  <Text style={GlobalStyles.logo.textSmall}>HIVE</Text>
                </View>
              </View>

              {/* conditional section for handling error messaging */}
              {errorMessage && (
                <Text
                  style={GlobalStyles.text.error}
                  accessibilityLiveRegion="polite"
                >
                  {errorMessage}
                </Text>
              )}

              {/* form for adding the account details */}
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="First Name"
                placeholderTextColor="#ffffff"
                value={firstName}
                onChangeText={setFirstName}
                accessibilityLabel="Enter your first name"
              />
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="Last Name"
                placeholderTextColor="#ffffff"
                value={lastName}
                onChangeText={setLastName}
                accessibilityLabel="Enter your last name"
              />
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="Email"
                placeholderTextColor="#ffffff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Enter your email"
              />
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="Password"
                placeholderTextColor="#ffffff"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                accessibilityLabel="Enter your password"
              />
              <TextInput
                style={GlobalStyles.input.field}
                placeholder="Confirm Password"
                placeholderTextColor="#ffffff"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                accessibilityLabel="Re-enter your password"
              />

              <TouchableOpacity
                style={GlobalStyles.button.primary}
                onPress={handleSignUp}
                accessibilityLabel="Sign up for a new account"
              >
                <Text style={GlobalStyles.button.text}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to login screen"
              >
                <Text style={GlobalStyles.text.closeButton}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

// ==== Page Specific Styles ====//
const styles = StyleSheet.create({
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  textColumn: {
    flexDirection: 'column',
    marginLeft: 10,
  },
});

export default SignupScreen;