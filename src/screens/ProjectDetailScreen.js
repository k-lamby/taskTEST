//=======================================================//
// ProjectDetailsScreen.js
// Provides a detailed view of a project, listing tasks,
// recent activities, and associated users. Users can 
// add tasks, toggle completion, and view task details.
//=======================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Plus, CheckCircle, Circle } from "lucide-react-native";

import {
  fetchTasksByProjectId,
  createTaskWithSubtasks,
  toggleTaskCompletion, 
} from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import { fetchProjectUserIds } from "../services/projectService";
import { fetchUserNamesByIds } from "../services/authService";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import CreateTaskModal from "../components/AddTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import GradientBackground from "../components/GradientBackground";
import GlobalStyles from "../styles/styles";

const ProjectDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { projectId, projectName } = route.params;

  const [tasks, setTasks] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  // Fetch tasks, users, and activities when the component mounts
  useEffect(() => {
    fetchTasks();
    fetchActivities();
    fetchUsers();
  }, [projectId]);

  /** Fetches tasks associated with the project and sorts by due date */
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const fetchedTasks = await fetchTasksByProjectId(projectId);
      fetchedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  /** Fetches recent activities for the project */
  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const fetchedActivities = await fetchRecentActivities(projectId);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  /** Fetches project users' details */
  const fetchUsers = async () => {
    try {
      const userIds = await fetchProjectUserIds(projectId);
      const projectUsers = await fetchUserNamesByIds(userIds);
      setProjectUsers(Object.entries(projectUsers).map(([id, name]) => ({ id, name: name || "Unknown" })));
    } catch (error) {
      console.error("Error fetching project users:", error);
    }
  };

  /** Opens the TaskDetailModal when a task is selected */
  const onTaskDetail = (task) => {
    setSelectedTask(task);
  };

  return (
    <GradientBackground>
      <TopBar title={projectName} />
      <View style={GlobalStyles.container}>
        {/* Task List */}
        <TaskList 
          tasks={tasks} 
          projectUsers={projectUsers} 
          loading={loadingTasks} 
          onToggleTaskCompletion={fetchTasks} 
          onTaskDetail={onTaskDetail} 
          onAddTask={() => setAddTaskModalVisible(true)}
        />

        {/* Recent Activities Section ✅ */}
        <ActivityList activities={activities} loading={loadingActivities} />

        {/* Task Creation Modal */}
        <CreateTaskModal
          visible={addTaskModalVisible}
          onClose={() => setAddTaskModalVisible(false)}
          onTaskAdded={fetchTasks}
          projectId={projectId}
          projectUsers={projectUsers}
          createTaskWithSubtasks={createTaskWithSubtasks}
        />

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            projectUsers={projectUsers}
            visible={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={fetchTasks}
          />
        )}
      </View>

      <BottomBar navigation={navigation} activeScreen="ProjectDetail" />
    </GradientBackground>
  );
};

//=======================================================//
// TaskList Component
// Displays list of tasks with the ability to add new ones
//=======================================================//
const TaskList = ({ tasks, projectUsers, loading, onToggleTaskCompletion, onTaskDetail, onAddTask }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>Project Tasks</Text>
        <TouchableOpacity onPress={onAddTask} accessibilityLabel="Add a new task">
          <Plus color="#FFA500" size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="medium" color="#ffffff" />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              projectUsers={projectUsers}
              onToggleTaskCompletion={onToggleTaskCompletion}
              onTaskDetail={onTaskDetail} // ✅ Clicking task text opens TaskDetailModal
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={GlobalStyles.translucentText}>No tasks created yet.</Text>
      )}
    </View>
  );
};

//=======================================================//
// TaskItem Component
// Displays an individual task with completion toggle
// and navigation to task details
//=======================================================//
const TaskItem = ({ item, projectUsers, onToggleTaskCompletion, onTaskDetail }) => {
  const assignedUser = projectUsers.find((user) => user.id === item.owner);

  return (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => onTaskDetail(item)} // ✅ Open TaskDetailModal on text click
      accessibilityLabel={`View details of task: ${item.name}`}
    >
      {/* ✅ Task Completion Toggle */}
      <TouchableOpacity
        onPress={async () => {
          await toggleTaskCompletion(item.id, item.status);
          onToggleTaskCompletion();
        }}
        accessibilityLabel={`Mark task ${item.name} as ${
          item.status === "completed" ? "pending" : "completed"
        }`}
      >
        {item.status === "completed" ? (
          <CheckCircle color="#4CBB17" size={20} />
        ) : (
          <Circle color="#BBBBBB" size={20} />
        )}
      </TouchableOpacity>

      {/* ✅ Task Name & Assigned User (Stacked) */}
      <View style={styles.taskTextContainer}>
        <Text style={GlobalStyles.normalText}>{item.name}</Text>
        <Text style={[GlobalStyles.translucentText,{fontSize: 12, paddingBottom: 8}]}>
          Assigned to: {assignedUser ? assignedUser.name : "Unassigned"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

//=======================================================//
// ActivityList Component ✅
// Displays recent activities related to the project
//=======================================================//
const ActivityList = ({ activities, loading }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>Recent Activities</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="medium" color="#ffffff" />
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <View style={GlobalStyles.listItem}>
              <Text style={GlobalStyles.normalText}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={GlobalStyles.translucentText}>No recent activities.</Text>
      )}
    </View>
  );
};

//=======================================================//
// Styles for TaskItem Component
// Ensures proper alignment and spacing
//=======================================================//
const styles = {
  taskContainer: {
    flexDirection: "row",
    alignItems: "top",
    gap: 10, // ✅ Space between checkbox and text
  },
  taskTextContainer: {
    flexDirection: "column", // ✅ Stack task name & assigned user
  },
  assignedText: {
    fontSize: 12,
    color: "#CCCCCC", 
  },
};

export default ProjectDetailScreen;