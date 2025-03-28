//=======================================================//
// SummaryScreen.js
// This is the landing screen after login.
// Displays featured projects, assigned tasks, and activity.
// Dynamically fetches project users for task assignment logic.
//=======================================================//

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { FolderKanban } from "lucide-react-native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import TaskList from "../components/TaskList";
import ActivityList from "../components/ActivityList";

import { useProjectService } from "../services/projectService";
import {
  fetchTasksForUser,
  toggleTaskCompletion,
} from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import { fetchUserNamesByIds } from "../services/authService";
import { fetchProjectUserIds } from "../services/projectService";

import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const SummaryScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projectUsersMap, setProjectUsersMap] = useState({});

  const { userId, firstName } = useUser();
  const { fetchProjects } = useProjectService();

  //======================================================
  // Load featured projects, assigned tasks, and activities
  // Also fetch project users for task modal functionality
  //======================================================
  const fetchData = useCallback(async () => {
    try {
      // 1️⃣ Fetch top 3 projects
      const projectData = await fetchProjects();
      const topProjects = projectData.slice(0, 3);
      setProjects(topProjects);

      // 2️⃣ Fetch top 3 tasks assigned to current user
      const assignedTasks = await fetchTasksForUser(userId, 3);
      setTasks(assignedTasks);

      // 3️⃣ Fetch recent activity (limit 3)
      const projectIds = projectData.map((p) => p.id);
      const recentActivities = await fetchRecentActivities(projectIds, 3);
      const enrichedActivities = recentActivities.map((activity) => {
        const project = projectData.find(p => p.id === activity.projectId);
        const title = project ? project.name : "Unnamed Project";
      
        return {
          ...activity,
          title,
          };
      });
      setActivities(enrichedActivities);

      // 4️⃣ Fetch project users for each referenced project
      const usersByProject = {};

      for (const project of topProjects) {
        const userIds = await fetchProjectUserIds(project.id);
        const userMap = await fetchUserNamesByIds(userIds);
        usersByProject[project.id] = Object.entries(userMap).map(
          ([id, name]) => ({
            id,
            name,
          })
        );
      }

      setProjectUsersMap(usersByProject);
    } catch (err) {
      Alert.alert("Error fetching data", err.message);
      console.error("❌ SummaryScreen fetch error:", err);
    }
  }, [fetchProjects, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //======================================================
  // Toggle completion status of a task assigned to user
  //======================================================
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(taskId, currentStatus, userId);

      // Update local state for immediate UI feedback
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: currentStatus === "completed" ? "pending" : "completed",
                completedAt: currentStatus === "completed" ? null : new Date(),
              }
            : task
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update task.");
    }
  };

  //======================================================
  // Render Featured Projects List
  //======================================================
  const renderProjects = () => (
    <View style={GlobalStyles.layout.container}>
      <View style = {GlobalStyles.layout.header}>
        <Text style={GlobalStyles.layout.title}>Featured Projects</Text>
      </View>

      {projects.length === 0 ? (
        <Text style={GlobalStyles.text.translucent}>No projects found.</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.layout.listItem}
              onPress={() =>
                navigation.navigate("ProjectDetail", {
                  projectId: item.id,
                  projectName: item.name,
                })
              }
              accessibilityLabel={`Open project: ${item.name}`}
              accessible={true}
            >
              <FolderKanban size={18} color="#FFA500" />
              <Text style={[GlobalStyles.text.white, { paddingLeft: 10 }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={GlobalStyles.layout.seeMore}
        onPress={() => navigation.navigate("Projects")}
        accessibilityLabel="See more projects"
        accessible={true}
      >
        <Text style={GlobalStyles.text.highlight}>See More →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground>
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      <View style={GlobalStyles.container.base}>
        {/* ✅ Featured Projects */}
        {renderProjects()}

        {/* ✅ Featured Tasks with dynamic project users */}
        <TaskList
          tasks={tasks}
          navigation={navigation}
          onToggleTaskStatus={handleToggleTaskStatus}
          title="Your Featured Tasks"
          showSeeMore={true}
          projectUsersMap={projectUsersMap}
        />

        {/* ✅ Recent Activity */}
        <ActivityList activities={activities} navigation={navigation} />
      </View>

      {/* ✅ Bottom Navigation Bar */}
      <BottomBar
        navigation={navigation}
        activeScreen="Summary"
        userId={userId}
        onProjectCreated={fetchData} // Refreshes project list on new project creation
      />
    </GradientBackground>
  );
};

export default SummaryScreen;