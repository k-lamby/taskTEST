// ========================TasksScreen.js=========================//
// Displays all tasks assigned to the current user.
// Includes "traffic light" priority indicators and activity history.
// ==============================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { CheckCircle, Circle, Hourglass, Edit } from "lucide-react-native";

import GradientBackground from "../components/GradientBackground";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import TaskDetailModal from "../components/modals/TaskDetailModal";
import ActivityInfoModal from "../components/modals/ActivityInfoModal";

import { fetchTasksForUser, toggleTaskCompletion } from "../services/taskService";
import { fetchProjectById } from "../services/projectService";
import { fetchActivitiesForTasks } from "../services/activityService";
import { fetchUserNamesByIds } from "../services/authService";
import { getActivityIcon } from "../utils/iconUtils";

import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

// returns the color for the task priority
const getImportanceColor = (importance) => {
  switch (importance) {
    case "high":
      return "#FF4C4C";
    case "medium":
      return "#FFC107";
    case "low":
      return "#4CAF50";
    default:
      return "#999999";
  }
};

const TasksScreen = ({ navigation }) => {
  // states for storing information from the database
  const [usersTasks, setUsersTasks] = useState([]);
  const [taskActivities, setTaskActivities] = useState({});
  const [projectNames, setProjectNames] = useState({});
  const [userNames, setUserNames] = useState({});
  // states for storing the details of the task we are interacting with
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  // states for controlling the visibility of the modals
  const [modalVisible, setModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);

  const { userId } = useUser();

  //load tasks when initial landing on the page
  useEffect(() => {
    if (userId) loadUserTasks();
  }, [userId]);

  const loadUserTasks = async () => {
    try {
      // get the tasks for the user
      const tasks = await fetchTasksForUser(userId);
      setUsersTasks(tasks);

      // then grab all the unique projectids for the tasks
      // we want to be able to display the project name associated with the task
      const uniqueProjectIds = [...new Set(tasks.map((t) => t.projectId))];
      const projectNameMap = {};
      for (const pid of uniqueProjectIds) {
        if (pid) {
          const project = await fetchProjectById(pid);
          projectNameMap[pid] = project.name || "Unnamed Project";
        }
      }
      setProjectNames(projectNameMap);

      // then get unique task ids, and get all the activities associated with those tasks
      const taskIds = tasks.map((t) => t.id);
      const activities = await fetchActivitiesForTasks(taskIds);

      // we then group each activity by task
      const groupedActivities = {};
      activities.forEach((activity) => {
        const tid = activity.taskId;
        if (!groupedActivities[tid]) groupedActivities[tid] = [];
        groupedActivities[tid].push(activity);
      });
      setTaskActivities(groupedActivities);
    } catch (error) {
      Alert.alert("Error", "Could not load tasks.");
    }
  };

  useEffect(() => {
    // we then want to grab all the usernames for the tasks
    // so we can display them alongside the activity
    const loadUserNames = async () => {
      const allActivities = Object.values(taskActivities).flat();
      const uniqueUserIds = [...new Set(allActivities.map((a) => a.userId).filter(Boolean))];

      if (uniqueUserIds.length === 0) return;

      try {
        const namesMap = await fetchUserNamesByIds(uniqueUserIds);
        setUserNames(namesMap);
      } catch (error) {
        Alert.alert("Failed to fetch user names:", error);
      }
    };

    if (Object.keys(taskActivities).length > 0) {
      loadUserNames();
    }
  }, [taskActivities]);

  // for handling the toggling of a task status between complete and pending
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(taskId, currentStatus, userId);
      setUsersTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: currentStatus === "completed" ? "pending" : "completed" }
            : task
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update task status.");
    }
  };

  // helper function for opening the task modal.
  const handleOpenTaskModal = async (task) => {
    try {
      const project = await fetchProjectById(task.projectId);
      const users = project.sharedWith || [];

      setSelectedProjectUsers(users);
      setSelectedTask(task);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Unable to load project data.");
    }
  };

  // when the task modal is closed we want to clear the states
  const handleCloseTaskModal = () => {
    setSelectedTask(null);
    setSelectedProjectUsers([]);
    setModalVisible(false);
  };

  // when an activity is pressed the action is different depending on 
  // the type of activity the user is interacting with
  const handleActivityPress = (activity) => {
    if (activity.activityType === "image" || activity.activityType === "file") {
      navigation.navigate("FilePreviewer", {
        fileUrl: activity.fileUrl,
        fileName: activity.fileName,
        fileType: activity.activityType,
      });
    } else {
      setSelectedActivity(activity);
      setActivityModalVisible(true);
    }
  };

  // component for handling the render of a single task
  const renderTask = ({ item }) => {
    // variables for handling what is displayed to the user
    const isCompleted = item.status === "completed";
    const StatusIcon = isCompleted ? CheckCircle : Hourglass;
    const projectName = projectNames[item.projectId] || "Unknown Project";
    const activities = taskActivities[item.id] || [];
    const importanceColor = getImportanceColor(item.priority);

    return (
      <View style={GlobalStyles.layout.container}>
        <View style={styles.taskHeader}>
          <View
            style={[styles.importanceBar, { backgroundColor: importanceColor }]}
            accessibilityLabel={`Task importance: ${item.importance || "unknown"}`}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                GlobalStyles.layout.title,
                isCompleted && styles.completedText,
              ]}
              accessibilityRole="header"
              accessibilityLabel={`Task name: ${item.name}`}
            >
              {item.name}
            </Text>
          </View>

          <View style={GlobalStyles.nav.iconRow}>
            <TouchableOpacity
              onPress={() => handleToggleTask(item.id, item.status)}
              accessibilityLabel={
                isCompleted
                  ? `Mark task ${item.name} as pending`
                  : `Mark task ${item.name} as completed`
              }
              style={styles.iconTouch}
            >
              {isCompleted ? (
                <CheckCircle size={20} color="#4CAF50" strokeWidth={2} />
              ) : (
                <Circle size={20} color="#888" strokeWidth={2} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOpenTaskModal(item)}
              accessibilityLabel={`Open details for task ${item.name}`}
              style={styles.iconTouch}
            >
              <Edit size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={GlobalStyles.text.translucentSmall}>Project: {projectName}</Text>
        <Text style={[GlobalStyles.text.translucentSmall, { marginTop: 4 }]}>
          {item.description || "No description available."}
        </Text>

        <View style={styles.metaRow}>
          <Text style={GlobalStyles.text.translucentSmall}>
            Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"}
          </Text>

          <View style={styles.statusWrapper}>
            <StatusIcon
              color={isCompleted ? "#4CAF50" : "#FFA500"}
              size={18}
              accessibilityLabel={`Status: ${isCompleted ? "Completed" : "Pending"}`}
            />
            <Text
              style={[
                GlobalStyles.text.translucentSmall,
                styles.statusText,
                isCompleted ? styles.completed : styles.pending,
              ]}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>

        {activities.length > 0 && (
          <View style={styles.activityRow}>
            {activities.map((act, index) => {
              const iconElement = getActivityIcon(act.type);
              const displayName = userNames[act.userId] || "Someone";

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.activityItem}
                  onPress={() => handleActivityPress(act)}
                  accessibilityLabel={`Activity by ${displayName}: ${act.content || act.type}`}
                >
                  <View style={styles.activityIcon}>{iconElement}</View>
                  <View style={styles.activityTextWrapper}>
                    <Text style={GlobalStyles.text.white} numberOfLines={1}>
                      {act.content || act.type}
                    </Text>
                    <Text style={GlobalStyles.text.translucentSmall}>
                      by {displayName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <GradientBackground>
      <TopBar title="My Tasks" />

      <View style={GlobalStyles.container.base}>
        <FlatList
          data={usersTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[GlobalStyles.text.translucent, styles.emptyText]}>
              No tasks assigned to you.
            </Text>
          }
        />
      </View>

      <BottomBar navigation={navigation} activeScreen="Tasks" />

      {selectedTask && modalVisible && selectedProjectUsers.length > 0 && (
        <TaskDetailModal
          task={selectedTask}
          visible={modalVisible}
          onClose={handleCloseTaskModal}
          projectUsers={selectedProjectUsers}
          onUpdateTask={({ id, updates }) => {
            setUsersTasks((prev) =>
              prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
            );
          }}
        />
      )}

      {selectedActivity && activityModalVisible && (
        <ActivityInfoModal
          visible={activityModalVisible}
          onClose={() => {
            setActivityModalVisible(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
        />
      )}
    </GradientBackground>
  );
};

//===== Page Specific Styles ====//
const styles = StyleSheet.create({
  iconTouch: {
    padding: 6,
    borderRadius: 6,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 5,
  },
  importanceBar: {
    width: 6,
    height: "50%",
    borderRadius: 2,
    marginRight: 0,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
  },
  completed: {
    color: "#4CAF50",
  },
  pending: {
    color: "#FFA500",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  activityRow: {
    marginTop: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  activityIcon: {
    marginTop: 3,
    marginRight: 6,
  },
  activityTextWrapper: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});

export default TasksScreen;