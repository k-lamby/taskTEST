import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import GlobalStyles from "../styles/styles";
import LoginModal from "../components/LoginModal";
import GradientBackground from "../components/GradientBackground";

/**
 * HomeScreen Component
 *
 * Entry point of the app. Users can log in or sign up from here.
 *
 * @param {object} navigation React Navigation prop
 */
const LoginScreen = ({ navigation }) => {
  // State to control visibility of login modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={GlobalStyles.fullPageContainer}>
        {/* Branding */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={GlobalStyles.logo}
          accessibilityLabel="taskHIVE logo"
        />
        <Text style={GlobalStyles.logoText}>task</Text>
        <Text style={GlobalStyles.logoText}>HIVE</Text>
        <Text style={GlobalStyles.subheaderText}>Transform Chaos Into Clarity</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[GlobalStyles.primaryButton, styles.equalWidthButton]}
            onPress={() => setModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Log In"
          >
            <Text style={GlobalStyles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GlobalStyles.secondaryButton, styles.equalWidthButton]}
            onPress={() => navigation.navigate("Signup")}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={GlobalStyles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Modal */}
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  equalWidthButton: {
    width: "50%",
  },
});

export default LoginScreen;