//================== TopBar.js ===========================//
// Reusable top section component with logo + title text.
// Uses SafeAreaView to respect device-specific insets.
//========================================================//

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import GlobalStyles from '../styles/styles';

// App logo
const logo = require('../../assets/images/logo.png');

const TopBar = ({ title }) => {
  return (
    <SafeAreaView style={GlobalStyles.nav.safeArea}>
      <View style={GlobalStyles.nav.topBarContainer}>
        {/* 🐝 Logo */}
        <Image source={logo} style={styles.logo} />

        {/* 🧭 Title */}
        <Text style={GlobalStyles.text.headerLg}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default TopBar;

//================= Page-Specific Styles =================//
const styles = StyleSheet.create({
  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
});