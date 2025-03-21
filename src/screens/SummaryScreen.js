//================== SummaryScreen.js ===========================//
// This is the landing page for the user on login. It displays
// featured projects, featured tasks, and any recent activity.
//================================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FolderKanban } from "lucide-react-native"; 

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

  // State variables for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details from context
  const { userId, firstName } = useUser();

  // Fetch project service functions
  const { fetchProjects } = useProjectService();

  useEffect(() => {
    // Fetch data when the component mounts or userId changes
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch the user's projects (limit to 3 for display)
        const projectData = await fetchProjects();
        setProjects(projectData.slice(0, 3));

        // Fetch tasks for projects the user is assigned to (limit to 3)
        const assignedTasks = await fetchTasksForAssignedProjects(userId);
        setTasks(assignedTasks.slice(0, 3));

        // Fetch recent activities related to the user's assigned projects
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
  }, [userId, fetchProjects]);

  return (
    <GradientBackground>
      {/* Top navigation bar with user greeting */}
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      <View style={GlobalStyles.container}>
        {/* Featured Projects Section */}
        <SectionList
          title="Featured Projects"
          data={projects}
          noDataText="No projects found."
          navigateTo="Projects"
          navigation={navigation}
          type="project"
        />

        {/* Featured Tasks Section */}
        <SectionList
          title="Featured Tasks"
          data={tasks}
          noDataText="No tasks found."
          navigateTo="Tasks"
          navigation={navigation}
          type="task"
        />

        {/* Recent Activities Section */}
        <SectionList
          title="Recent Activities"
          data={activities}
          noDataText="No activities found."
          navigateTo="Activities"
          navigation={navigation}
          type="activity"
        />
      </View>

      {/* Bottom navigation bar */}
      <BottomBar navigation={navigation} activeScreen="Summary" userId={userId} />
    </GradientBackground>
  );
};

// =================== Reusable SectionList Component =================== //
// This component renders a section containing a title, a list of items, 
// and a "See More" button for navigation.

const SectionList = ({ title, data, noDataText, navigateTo, navigation, type }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      {/* Section Header */}
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{title}</Text>
      </View>

      {/* Loading Indicator while fetching data */}
      {data.length === 0 ? (
        <Text style={GlobalStyles.translucentText}>{noDataText}</Text>
      ) : (
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

                } else if (type === "activity") {

                }
              }}
              accessibilityLabel={`Open ${title} item: ${item.name || item.title || item.description}`}
              accessible={true}
            >
              <Text style={GlobalStyles.normalText}>
                <FolderKanban color="#FFA500" size={18} />
              </Text>
              <Text style={[GlobalStyles.normalText, { paddingLeft: 10 }]}>
                {item.name || item.title || item.description}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {/* See More Button */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate(navigateTo)}
        accessibilityLabel={`See more ${title}`}
        accessible={true}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SummaryScreen;