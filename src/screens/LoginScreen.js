//================ LoginScreen.js ========================//
// This is the entrance point into the application, using
// react navigation with stack the screens to be displayed
//========================================================//

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";

import LoginModal from "../components/modals/LoginModal";
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
      <View style={GlobalStyles.container.fullPage}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={GlobalStyles.logo.image}
          accessibilityLabel="taskHIVE logo"
        />
        <Text style={GlobalStyles.logo.textLarge}>task</Text>
        <Text style={GlobalStyles.logo.textLarge}>HIVE</Text>
        <Text style={GlobalStyles.text.headerMd}>Transform Chaos Into Clarity</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[GlobalStyles.button.primary, styles.equalWidthButton]}
            onPress={() => setLoginVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Log In"
          >
            <Text style={GlobalStyles.button.text}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GlobalStyles.button.secondary, styles.equalWidthButton]}
            onPress={() => navigation.navigate("Signup")}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={GlobalStyles.button.text}>Sign Up</Text>
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