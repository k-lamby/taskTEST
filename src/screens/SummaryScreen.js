//====================SummaryScreen.js======================//
// intial landing screen after logging in, displays basic 
// project info, task info, activity info.
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
  // used for storing data pulled from the database
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projectUsersMap, setProjectUsersMap] = useState({});

  const { userId, firstName } = useUser();
  const { fetchProjects } = useProjectService();

  // fetch data outside of the use effect so we can call this
  // whenever we update information and need to refresh the view
  const fetchData = useCallback(async () => {
    try {
      // fetch random 3 projects
      const projectData = await fetchProjects();
      const topProjects = projectData.slice(0, 3);
      setProjects(topProjects);

      // fetch random 3 projects for the user
      const assignedTasks = await fetchTasksForUser(userId, 3);
      setTasks(assignedTasks);

      // fetch 3 most recent activities for the projects
      const projectIds = projectData.map((p) => p.id);
      const recentActivities = await fetchRecentActivities(projectIds, 3);
      // add contextual information to the activity like project
      const enrichedActivities = recentActivities.map((activity) => {
        const project = projectData.find(p => p.id === activity.projectId);
        const title = project ? project.name : "Unnamed Project";
      
        return {
          ...activity,
          title,
          };
      });
      setActivities(enrichedActivities);

      // we then need to get users for each project so we can
      // display the activity with the user who performed it
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
    }
  }, [fetchProjects, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // allows the user to toggle the status of a task
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(taskId, currentStatus, userId);

      // update the local UI state to display the change immediately
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

  // section for rendering projects
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

  // return all the different components
  return (
    <GradientBackground>
      <TopBar title={`Welcome, ${firstName || "User"}!`} />

      <View style={GlobalStyles.container.base}>
        {renderProjects()}
        <TaskList
          tasks={tasks}
          navigation={navigation}
          onToggleTaskStatus={handleToggleTaskStatus}
          title="Your Featured Tasks"
          showSeeMore={true}
          projectUsersMap={projectUsersMap}
        />
        <ActivityList activities={activities} navigation={navigation} />
      </View>
      <BottomBar
        navigation={navigation}
        activeScreen="Summary"
        userId={userId}
        onProjectCreated={fetchData}
      />
    </GradientBackground>
  );
};

export default SummaryScreen;