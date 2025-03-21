//================== App.js ===========================//
// This is the entrance point into the application, using
// react navigation with stack the screens to be displayed
//========================================================//

// import core dependencies
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

// import user context, this allows as to store who the current user is
import { UserProvider } from './src/contexts/UserContext';

// import all the screens for the application
import {
  LoginScreen,
  SignupScreen,
  SummaryScreen,
  ProjectsScreen,
  TasksScreen,
  SettingsScreen,
  ProjectDetailScreen,
} from './src/screens';

// create our navigation stack
const Stack = createNativeStackNavigator();

// main app component, handles the font loading, navigation etc
export default function App() {
  // load the custom font asyncronously
  const [fontsLoaded, fontError] = useFonts({
    'Akzidenz-grotesk-bold': require('./assets/fonts/Akzidenz-grotesk-bold.ttf'),
    'Akzidenz-grotesk-light': require('./assets/fonts/Akzidenz-grotesk-light.ttf'),
  });

  // display loading message while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" accessibilityLabel="Loading resources, please wait..." />
      </View>
    );
  }

  // handle font loading error, for now just request the user to restart
  if (fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" accessibilityLabel="Error loading fonts, please restart." />
      </View>
    );
  }

  // main app rendering after resources are loaded
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Sign Up" }}
          />
          <Stack.Screen
            name="Summary"
            component={SummaryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Projects"
            component={ProjectsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Tasks"
            component={TasksScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProjectDetail"
            component={ProjectDetailScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

// ==== Page Specific Styles ====>
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});