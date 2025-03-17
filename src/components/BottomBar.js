//================== BottomBar.js ===========================//
// This is the toolbar at the bottom of the page.
// It is displayed throughout the application whenever the user is logged in.
// It includes navigation buttons and a button to create a new project.
//===========================================================//

import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faClipboardCheck, faCirclePlus, faCircleCheck, faUser } from "@fortawesome/free-solid-svg-icons";

import CreateProjectModal from "./CreateProjectModal"; // Moved here

const BottomBar = ({ navigation, activeScreen, userId }) => {
  // This state controls the visibility of the "Create Project" modal
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Create Project Modal (now inside BottomBar) */}
      <CreateProjectModal visible={isFormVisible} onClose={() => setFormVisible(false)} userId={userId} />

      {/* Bottom bar container */}
      <View style={styles.container}>
        {/* Summary (Home) Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Summary")}
          style={[styles.iconContainer, activeScreen === "Summary" && styles.activeIconContainer]}
        >
          <FontAwesomeIcon icon={faHouse} size={24} style={[styles.icon, activeScreen === "Summary" && styles.activeIcon]} />
        </TouchableOpacity>

        {/* Projects Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Projects")}
          style={[styles.iconContainer, activeScreen === "Projects" && styles.activeIconContainer]}
        >
          <FontAwesomeIcon icon={faClipboardCheck} size={24} style={[styles.icon, activeScreen === "Projects" && styles.activeIcon]} />
        </TouchableOpacity>

        {/* Add Project Icon */}
        <TouchableOpacity onPress={() => setFormVisible(true)} style={styles.iconContainer}>
          <FontAwesomeIcon icon={faCirclePlus} size={24} style={styles.icon} />
        </TouchableOpacity>

        {/* Tasks Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Tasks")}
          style={[styles.iconContainer, activeScreen === "Tasks" && styles.activeIconContainer]}
        >
          <FontAwesomeIcon icon={faCircleCheck} size={24} style={[styles.icon, activeScreen === "Tasks" && styles.activeIcon]} />
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={[styles.iconContainer, activeScreen === "Settings" && styles.activeIconContainer]}
        >
          <FontAwesomeIcon icon={faUser} size={24} style={[styles.icon, activeScreen === "Settings" && styles.activeIcon]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//======== Page-Specific Styles ===============//
const styles = StyleSheet.create({
  // Ensures the bottom bar is rendered within the viewable area of the device
  safeArea: {
    backgroundColor: "#001524",
    width: "100%",
  },
  // Container for bottom bar buttons
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#001524",
    paddingVertical: 10,
  },
  // Default icon container style
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    padding: 10,
  },
  // Default icon style
  icon: {
    fontSize: 24,
    color: "white",
  },
  // If the active screen corresponds to the container, highlight the icon
  activeIconContainer: {
    backgroundColor: "rgba(255, 125, 0, 0.2)",
  },
  activeIcon: {
    fontSize: 24,
    color: "rgba(255, 125, 0, 1)",
  },
});

export default BottomBar;