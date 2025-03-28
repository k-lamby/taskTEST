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
    <View style={GlobalStyles.container.gradient}>
      {/* Set the gradiant colour as the background */}
      <LinearGradient
        colors={["#001524", "#15616D"]}
        style={GlobalStyles.container.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* then image is placed on top of the gradient */}
      <Image
        source={require("../../assets/images/beeHive.png")}
        style={GlobalStyles.container.image}
        resizeMode="contain"
        accessible={false}
      />

      {/* then we specify where the children all go */}
      <View style={GlobalStyles.container.content}>{children}</View>
    </View>
  );
};

export default GradientBackground;