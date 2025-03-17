//================== SummaryScreen.js ===========================//
// This is the landing page for the user on login, it will display
// featured projects, featured tasks and any recent activity
//========================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import useProjectService from "../services/projectService";
import { fetchTasksForAssignedProjects } from "../services/taskService"; 
import { fetchRecentActivities } from "../services/activityService";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const SummaryScreen = ({ navigation }) => {
  // State variables for storing projects, tasks, and activities
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // state variables for displaying loading icon, or errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details from context
  const { userId, userEmail, firstName } = useUser();

  // Fetch project service functions
  const { fetchProjects } = useProjectService();

  // Fetch data when the component mounts or userId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch the user's projects (limit to 3 for display)
        const projectData = await fetchProjects();
        setProjects(projectData.slice(0, 3));

        // Fetch tasks for projects the user is assigned to (limit to 3)
        const assignedTasks = await fetchTasksForAssignedProjects(userId);
        setTasks(assignedTasks.slice(0, 3));

        // fetch recent activities related to the user's assigned projects
        const recentActivities = await fetchRecentActivities(userId);
        setActivities(recentActivities.slice(0, 3));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userEmail, fetchProjects]);

  // helper function for rendering each section as these are displayed the same
  const renderSection = (title, data, noDataText, navigateTo, type) => (
    <View style={GlobalStyles.sectionContainer}>
      {/* Section Header */}
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{title}</Text>
      </View>
      {/* Loading Indicator while fetching data */}
      {loading ? (
        <ActivityIndicator size="medium" color="#ffffff" />
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.listItem}
              onPress={() => {
                if (type === "project") {
                  navigation.navigate("ProjectDetail", {
                    projectId: item.id,
                    projectName: item.name,
                  });
                } else if (type === "task") {
                  setSelectedTask(item);
                } else if (type === "activity") {
                  setSelectedActivity(item);
                }
              }}
            >
              <FontAwesomeIcon style={GlobalStyles.bulletPoint} icon={faBolt} />
              <Text style={GlobalStyles.normalText}>
                {item.name || item.title || item.description}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={GlobalStyles.translucentText}>{noDataText}</Text>
      )}

      {/* See More Button */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground>
      {/* Top navigation bar */}
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      <View style={GlobalStyles.container}>
        {/* Featured Projects Section */}
        {renderSection(
          "Featured Projects",
          projects,
          "No projects found.",
          "Projects",
          "project"
        )}

        {/* Featured Tasks Section */}
        {renderSection(
          "Featured Tasks",
          tasks,
          "No tasks found.",
          "Tasks",
          "task"
        )}

        {/* Recent Activities Section */}
        {renderSection(
          "Recent Activities",
          activities,
          "No activities found.",
          "Activities",
          "activity"
        )}
      </View>

      {/* Bottom navigation bar */}
      <BottomBar navigation={navigation} activeScreen="Summary" userId={userId} />
    </GradientBackground>
  );
};

export default SummaryScreen;