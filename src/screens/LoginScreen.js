//================ LoginScreen.js ========================//
// This is the entrance point into the application, using
// react navigation with stack the screens to be displayed
//========================================================//

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";

import LoginModal from "../components/LoginModal";
import GradientBackground from "../components/GradientBackground";

import GlobalStyles from "../styles/styles";

// takes navigation prop for navigating into the app
const LoginScreen = ({ navigation }) => {
  // State to control visibility of login modal
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    // use the gradient background component displays
    // gradient and a light blue hive
    <GradientBackground>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={GlobalStyles.fullPageContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={GlobalStyles.logo}
          accessibilityLabel="taskHIVE logo"
        />
        <Text style={GlobalStyles.logoText}>task</Text>
        <Text style={GlobalStyles.logoText}>HIVE</Text>
        <Text style={GlobalStyles.subheaderText}>Transform Chaos Into Clarity</Text>

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

      {/* login modal component for entering details */}
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        navigation={navigation}
      />
    </GradientBackground>
  );
};

//======Page Sepcific Styles =====//
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