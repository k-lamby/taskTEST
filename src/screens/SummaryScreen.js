//================== SummaryScreen.js ===========================//
// This is the landing page for the user on login. It displays
// featured projects, featured tasks, and any recent activity.
//================================================================//

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { FolderKanban } from "lucide-react-native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import TaskList from "../components/TaskList";
import ActivityList from "../components/ActivityList";

import { useProjectService } from "../services/projectService";
import { fetchTasksForUser, toggleTaskCompletion } from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import { useUser } from "../contexts/UserContext";

import GlobalStyles from "../styles/styles";

const SummaryScreen = ({ navigation }) => {
  // states for storing the data collected from the database
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // grab the user details from the user context
  const { userId, firstName } = useUser();
  // import fetch projects for grabbing the data
  const { fetchProjects } = useProjectService();

  // ===============================================================
  // fetchData utilises the various services
  // to pull the data forward and store it in local state
  // ===============================================================
  const fetchData = useCallback(async () => {
    try {
      // grab the top 3 projects
      const projectData = await fetchProjects();
      setProjects(projectData.slice(0, 3));

      // grab the top 3 tasks assigned to the current user
      const assignedTasks = await fetchTasksForUser(userId, 3);
      setTasks(assignedTasks);

      // grab the top 3 most recent activities
      const maxActivities = 3;

      // fetchRecentActivities expects an array of project ids
      const projectIds = projectData.map((project) => project.id);
      const recentActivities = await fetchRecentActivities(projectIds, maxActivities);
      setActivities(recentActivities);
    } catch (err) {
      // if there are any errors then just display an alert for now
      Alert.alert("Error fetching data:", err.message);
    }
  }, [fetchProjects, userId]);

  // ===============================================================
  // useEffect runs on initial mount to populate the dashboard data
  // ===============================================================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===============================================================
  // function to handle toggling a task's completion status
  // updates local task state and persists to Firebase
  // ===============================================================
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(taskId, currentStatus, userId);

      // update the local task list to reflect the change
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

  return (
    <GradientBackground>
      {/* TopBar with greeting */}
      <TopBar title={`Welcome, ${firstName || "User"}!`} />
      <View style={GlobalStyles.container}>

        {/* Project List Component, not reusable as this is only used here */}
        <View style={GlobalStyles.sectionContainer}>
          <View style={GlobalStyles.sectionHeader}>
            <Text style={GlobalStyles.sectionTitle}>Featured Projects</Text>
          </View>

          {projects.length === 0 ? (
            <Text style={GlobalStyles.translucentText}>No projects found.</Text>
          ) : (
            // clicking on a project will navigate you through to the project detail page
            <FlatList
              data={projects}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={GlobalStyles.listItem}
                  onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id })}
                  accessibilityLabel={`Open project: ${item.name}`}
                  accessible={true}
                >
                  <FolderKanban color="#FFA500" size={18} />
                  <Text style={[GlobalStyles.normalText, { paddingLeft: 10 }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}

          {/* Clicking on the see more navigates to the project summary */}
          <TouchableOpacity
            style={GlobalStyles.seeMore}
            onPress={() => navigation.navigate("Projects")}
            accessibilityLabel="See more projects"
            accessible={true}
          >
            <Text style={GlobalStyles.seeMoreText}>See More →</Text>
          </TouchableOpacity>
        </View>

        {/* Reusable task list component */}
        <TaskList
          tasks={tasks}
          navigation={navigation}
          onToggleTaskStatus={handleToggleTaskStatus}
        />

        {/* Reusable activity feed component */}
        <ActivityList activities={activities} navigation={navigation} />
      </View>

      {/* Persistent bottom bar with modal trigger and navigation */}
      <BottomBar 
        navigation={navigation} 
        activeScreen="Summary" 
        userId={userId}
        onProjectCreated={fetchData} // ✅ refresh project list on new project
      />
    </GradientBackground>
  );
};

export default SummaryScreen;