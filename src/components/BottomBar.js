//================== BottomBar.js ===========================//
// This component provides a fixed bottom toolbar for navigation.
// It includes buttons for navigating between key screens 
// and adding new projects.
//===========================================================//

import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Home, ClipboardCheck, PlusCircle, CheckCircle, User } from "lucide-react-native";

import CreateProjectModal from "./CreateProjectModal";
import GlobalStyles from "../styles/styles"; 

const BottomBar = ({ navigation, activeScreen, userId }) => {
  // state used for the create projectform visibility
  const [isProjectFormVisible, setProjectFormVisible] = useState(false);

  return (
    <SafeAreaView style={GlobalStyles.bottomBarSafeArea}>
      {/* Create Project Modal, slides up from the bottom */}
      <CreateProjectModal 
        visible={isProjectFormVisible} 
        onClose={() => setProjectFormVisible(false)} 
        userId={userId} />

      {/* bottom bar container, holds all the icons */}
      <View style={GlobalStyles.bottomBarContainer}>

        <NavButton 
          icon={Home} 
          label="Home" 
          screen="Summary" 
          navigation={navigation} 
          activeScreen={activeScreen} 
        />

        <NavButton 
          icon={ClipboardCheck} 
          label="Projects" 
          screen="Projects" 
          navigation={navigation} 
          activeScreen={activeScreen} 
        />

        {/* Add Project Button (Standalone) */}
        <TouchableOpacity
          onPress={() => setProjectFormVisible(true)}
          style={GlobalStyles.plusButton}
          accessibilityLabel="Create a new project"
          accessible={true}
        >
          <PlusCircle color="white" size={28} />
        </TouchableOpacity>

        <NavButton 
          icon={CheckCircle} 
          label="Tasks" 
          screen="Tasks" 
          navigation={navigation} 
          activeScreen={activeScreen} 
        />

        <NavButton 
          icon={User} 
          label="Settings" 
          screen="Settings" 
          navigation={navigation} 
          activeScreen={activeScreen} />
      </View>
    </SafeAreaView>
  );
};

// reusable navbutton for consistent styling
const NavButton = ({ icon: Icon, label, screen, navigation, activeScreen }) => {
  // if the screen is active we want the icon to be a different colour
  const isActive = activeScreen === screen;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(screen)}
      style={[GlobalStyles.bottomBarIconContainer, isActive && GlobalStyles.bottomBarActiveIconContainer]}
      accessibilityLabel={`Navigate to ${label}`}
      accessible={true}
    >
      <Icon color={isActive ? "rgba(255, 125, 0, 1)" : "white"} size={24} />
    </TouchableOpacity>
  );
};

export default BottomBar;