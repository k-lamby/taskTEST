//================== TopBar.js ===========================//
// This is a reusable component for the top of the screen
// It takes a `title` prop and displays it at the top
// Includes a small bee logo for the app
//========================================================//

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import GlobalStyles from '../styles/styles';

// get the logo from the assets file
const logo = require('../../assets/images/logo.png');

const TopBar = ({ title }) => {
  return (
    // using safearea as we know each mobile we have a different layout at the top
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        {/* Title text will be passed when rendering the component */}
        <Text style={GlobalStyles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

//========== Page specific styles ===============//
const styles = StyleSheet.create({
  // specifiy the colour for the top bar safe area
  // to be the same as the container so it blends together
  safeArea: {
    backgroundColor: '#001524',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  logo: {
    width: 35, 
    height: 35,
    marginRight: 10,
  },
});

export default TopBar;