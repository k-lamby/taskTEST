import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LogOut } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";

import {
  updateDisplayName,
  sendResetPasswordEmail,
  logOut,
} from "../services/authService";

import { getAuth } from "firebase/auth";
import GlobalStyles from "../styles/styles";

/**
 * @component AccountSettingsScreen
 * @description Account preferences screen with update name, reset password, and logout options.
 * Uses consistent layout with top and bottom bars and centralized GlobalStyles.
 */
const AccountSettingsScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  // 🔁 Update user's display name
  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      Alert.alert("Validation Error", "Display name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await updateDisplayName(displayName.trim());
      Alert.alert("Success", "Display name updated.");
    } catch (error) {
      Alert.alert("Error", "Could not update display name.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Send password reset email
  const handleResetPassword = async () => {
    try {
      await sendResetPasswordEmail();
      Alert.alert("Password Reset Sent", `Check your email: ${user?.email}`);
    } catch (error) {
      Alert.alert("Error", "Could not send password reset email.");
    }
  };

  // 🚪 Log out user and reset navigation stack
  const handleLogout = async () => {
    try {
      await logOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error", "Could not log out.");
    }
  };

  return (
    <GradientBackground>
      <TopBar title="Account Settings" />

      <KeyboardAvoidingView
        style={GlobalStyles.container.base}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            GlobalStyles.container.scroll,
            { paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={GlobalStyles.layout.container}>
            {/* 🔤 Display Name Field */}
            <Text
              style={[GlobalStyles.text.translucentSmall, GlobalStyles.input.label]}
            >
              Display Name
            </Text>

            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={GlobalStyles.input.field}
              placeholder="Enter display name"
              placeholderTextColor="#888"
              accessibilityLabel="Display name input"
              autoCapitalize="words"
              accessible
            />

            <Pressable
              style={GlobalStyles.button.primary}
              onPress={handleUpdateName}
              disabled={loading}
              accessibilityLabel="Save display name"
            >
              <Text style={GlobalStyles.button.text}>
                {loading ? "Saving..." : "Save Name"}
              </Text>
            </Pressable>

            {/* 🔐 Password Reset */}
            <Pressable
              style={GlobalStyles.button.secondary}
              onPress={handleResetPassword}
              accessibilityLabel="Send password reset email"
            >
              <Text style={GlobalStyles.button.text}>
                Send Password Reset Email
              </Text>
            </Pressable>

            {/* 🚪 Logout */}
            <Pressable
              style={[GlobalStyles.button.small, styles.logoutRow]}
              onPress={handleLogout}
              accessibilityLabel="Log out of your account"
            >
              <LogOut size={18} color="#fff" />
              <Text style={GlobalStyles.button.textSmall}>Log Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomBar navigation={navigation} activeScreen="Settings" />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  logoutRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default AccountSettingsScreen;