import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ImageBackground, Image, TouchableWithoutFeedback, 
  Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import GlobalStyles from '../styles/styles';
import GradientBackground from "../components/GradientBackground"; 
import { signUp } from '../services/authService';

const SignupScreen = ({ navigation }) => {
  // State variables for user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handles user sign-up process
  const handleSignUp = async () => {
    // Validate input fields
    if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
      Alert.alert("Error", "Please fill in all fields correctly.");
      return;
    }

    try {
      // Call Firebase sign-up function
      const user = await signUp(email, password, firstName, lastName);
      console.log("User signed up:", user);

      // Navigate to another screen after successful sign-up
      navigation.navigate('Home'); // Change 'Home' to the appropriate screen name
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <GradientBackground>
      {/* Background Image */}
      <ImageBackground 
        source={require('../../assets/images/beeHive.png')} // Update the path as necessary
        style={GlobalStyles.gradientContainer}
        resizeMode="cover"
      >
        {/* Keyboard Avoiding Wrapper */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.flexContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Dismiss keyboard when tapping outside input fields */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.container}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                  <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={[GlobalStyles.logo, { width: 70, height: 60 }]} // Smaller logo
                  />
                  <View style={styles.textContainer}>
                    <Text style={[GlobalStyles.logoText, { fontSize: 24 }]}>task</Text>
                    <Text style={[GlobalStyles.logoText, { fontSize: 24 }]}>HIVE</Text>
                  </View>
                </View>

                {/* Sign-Up Form */}
                <View style={styles.formContainer}>
                  <TextInput 
                    style={GlobalStyles.textInput} 
                    placeholder="First Name" 
                    placeholderTextColor="#ffffff" 
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  <TextInput 
                    style={GlobalStyles.textInput} 
                    placeholder="Last Name" 
                    placeholderTextColor="#ffffff" 
                    value={lastName}
                    onChangeText={setLastName}
                  />
                  <TextInput 
                    style={GlobalStyles.textInput} 
                    placeholder="Email" 
                    placeholderTextColor="#ffffff" 
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TextInput 
                    style={GlobalStyles.textInput} 
                    placeholder="Password" 
                    placeholderTextColor="#ffffff" 
                    secureTextEntry 
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TextInput 
                    style={GlobalStyles.textInput} 
                    placeholder="Confirm Password" 
                    placeholderTextColor="#ffffff" 
                    secureTextEntry 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />

                  {/* Sign-Up Button */}
                  <TouchableOpacity 
                    style={GlobalStyles.primaryButton} 
                    onPress={handleSignUp}
                  >
                    <Text style={GlobalStyles.primaryButtonText}>Sign Up</Text>
                  </TouchableOpacity>

                  {/* Back to Login Button */}
                  <TouchableOpacity 
                    style={GlobalStyles.secondaryButton} 
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={GlobalStyles.secondaryButtonText}>Back to Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </GradientBackground>
  );
};

// Styles specific to this screen
const styles = {
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Keeps everything centered
    alignItems: 'center',  // Centers content horizontally
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',  // Ensures centering
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers logo horizontally
    marginBottom: 20, // Adds spacing between logo and form
  },
  textContainer: {
    marginLeft: 10, // Adds spacing between logo and text
  },
  formContainer: {
    width: '80%',
    alignItems: 'center', // Centers the form horizontally
  },
};

export default SignupScreen;