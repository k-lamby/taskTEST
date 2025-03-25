//================== GradientBackground.js===========================//
// This reusable component provides a consistent gradient background 
// with an overlay image of a hex hive.
//===================================================================//

import React from "react";
import { View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "../styles/styles";

const GradientBackground = ({ children }) => {
  return (
    <View style={GlobalStyles.gradientContainer}>
      {/* Set the gradiant colour as the background */}
      <LinearGradient
        colors={["#001524", "#15616D"]}
        style={GlobalStyles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* then image is placed on top of the gradient */}
      <Image
        source={require("../../assets/images/beeHive.png")}
        style={GlobalStyles.overlayImage}
        resizeMode="contain"
        accessible={false}
      />

      {/* then we specify where the children all go */}
      <View style={GlobalStyles.contentContainer}>{children}</View>
    </View>
  );
};

export default GradientBackground;