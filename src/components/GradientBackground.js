//================== GradientBackground.js===========================//
import React from 'react';
import { View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalStyles from '../styles/styles'; // Adjust the path as necessary

const GradientBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={["#001524", "#15616D"]}
      style={GlobalStyles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <ImageBackground
        source={require("../../assets/images/beeHive.png")} // Adjust path as necessary
        style={GlobalStyles.gradientContainer}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    </LinearGradient>
  );
};

export default GradientBackground;