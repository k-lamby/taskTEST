//================== BottomBar.js ===========================//
// This component provides a fixed bottom navigation bar with accessible icons.
// It uses lucide-react-native icons and integrates with your style system.
//===========================================================//

import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Home, ClipboardCheck, PlusCircle, CheckCircle, User } from "lucide-react-native";

import CreateProjectModal from "./modals/CreateProjectModal";
import GlobalStyles from "../styles/styles";

const BottomBar = ({ navigation, activeScreen, userId, onProjectCreated }) => {
  const [isProjectFormVisible, setProjectFormVisible] = useState(false);

  return (
    <SafeAreaView style={GlobalStyles.nav.safeArea}>
      {/* Modal for creating a new project */}
      <CreateProjectModal
        visible={isProjectFormVisible}
        onClose={() => setProjectFormVisible(false)}
        userId={userId}
        onProjectCreated={onProjectCreated}
      />

      {/* Bottom navigation icon row */}
      <View style={GlobalStyles.nav.bottomBarContainer}>
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

        {/* Central Create Project Button */}
        <TouchableOpacity
          onPress={() => setProjectFormVisible(true)}
          style={[
            GlobalStyles.nav.iconContainer,
            {
              backgroundColor: "#FFA500", // highlight the central action
              borderRadius: 30,
              padding: 10,
              marginHorizontal: 8,
            },
          ]}
          accessibilityLabel="Create a new project"
          accessible
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
          activeScreen={activeScreen}
        />
      </View>
    </SafeAreaView>
  );
};

//================== Reusable Nav Button =====================//
const NavButton = ({ icon: Icon, label, screen, navigation, activeScreen }) => {
  const isActive = activeScreen === screen;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(screen)}
      style={[
        GlobalStyles.nav.iconContainer,
        isActive && GlobalStyles.nav.activeIconContainer,
      ]}
      accessibilityLabel={`Navigate to ${label}`}
      accessible
    >
      <Icon
        color={isActive ? "rgba(255, 125, 0, 1)" : "white"}
        size={24}
      />
    </TouchableOpacity>
  );
};

export default BottomBar;