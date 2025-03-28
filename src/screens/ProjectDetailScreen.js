import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  Edit,
  Archive,
  LogOut,
  UserPlus,
  Trash,
  Plus,
} from "lucide-react-native";

import GradientBackground from "../components/GradientBackground";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import TaskList from "../components/TaskList";
import ActivityList from "../components/ActivityList";
import AddTaskModal from "../components/modals/AddTaskModal";
import EditProjectModal from "../components/modals/EditProjectModal";
import AddUserModal from "../components/modals/AddUserModal";

import {
  fetchTasksByProjectId,
  toggleTaskCompletion,
} from "../services/taskService";
import { fetchRecentActivities } from "../services/activityService";
import {
  fetchProjectUserIds,
  fetchProjectById,
  archiveProject,
  leaveProject,
} from "../services/projectService";
import { fetchUserNamesByIds } from "../services/authService";

import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const ProjectDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { projectId } = route.params;
  const { userId } = useUser();

  const [projectMeta, setProjectMeta] = useState({
    name: "",
    description: "",
    ownerId: "",
  });
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [projectId]);

  const fetchAllData = async () => {
    await fetchProjectInfo();
    await fetchUsers();
    await fetchTasks();
    await fetchActivities();
  };

  const fetchProjectInfo = async () => {
    try {
      const data = await fetchProjectById(projectId);
      setProjectMeta({
        id: data.id,
        name: data.name,
        description: data.description,
        ownerId: data.createdBy,
      });
    } catch (err) {
      console.error("Failed to fetch project info:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const fetched = await fetchTasksByProjectId(projectId);
      fetched.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(fetched);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const fetched = await fetchRecentActivities([projectId]);
      const enrichedActivities = fetched.map((activity) => {
        const task = tasks.find((t) => t.id === activity.taskId);
        const title = task ? task.name : "Unnamed Task";
        return {
          ...activity,
          title,
        };
      });
      setActivities(enrichedActivities);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userIds = await fetchProjectUserIds(projectId);
      const userMap = await fetchUserNamesByIds(userIds);
      const userList = Object.entries(userMap).map(([id, name]) => ({
        id,
        name: name || "Unknown",
      }));
      setProjectUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    await toggleTaskCompletion(taskId, currentStatus);
    fetchTasks();
  };

  const handleArchiveProject = () => {
    Alert.alert(
      "Archive Project",
      "Are you sure you want to archive this project? You can restore it later from settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: async () => {
            try {
              await archiveProject(projectId);
              Alert.alert("Project archived");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", "Could not archive project.");
            }
          },
        },
      ]
    );
  };

  const handleLeaveProject = () => {
    Alert.alert(
      "Leave Project",
      "Are you sure you want to leave this project? You will lose access.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveProject(projectId, userId);
              Alert.alert("Left project successfully");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", "Could not leave project.");
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={GlobalStyles.container.base}>
      {/* 🔎 Project Overview */}
      <View style={GlobalStyles.layout.container}>
        <View style={GlobalStyles.layout.header}>
          <Text style={GlobalStyles.text.headerMd}>Project Overview</Text>
          <View style={GlobalStyles.nav.iconRow}>
            <TouchableOpacity
              accessibilityLabel="Add user"
              onPress={() => setAddUserModalVisible(true)}
            >
              <UserPlus size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Edit project"
              onPress={() => setEditModalVisible(true)}
            >
              <Edit size={20} color="#FFFFFF" />
            </TouchableOpacity>
            {projectMeta.ownerId === userId && (
              <TouchableOpacity
                accessibilityLabel="Archive project"
                onPress={handleArchiveProject}
              >
                <Trash size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 📄 Description */}
        <Text style={[GlobalStyles.text.translucent, { marginTop: 8 }]}>
          {projectMeta.description || "No description provided."}
        </Text>

        {/* 👥 Shared Users */}
        <View style={styles.sharedRow}>
          <View>
            <Text
              style={[GlobalStyles.text.translucentSmall, { marginTop: 16 }]}
            >
              Shared With
            </Text>
            <Text style={GlobalStyles.text.translucent}>
              {projectUsers?.length > 0
                ? projectUsers.map((u) => u.name).join(", ")
                : "Not shared"}
            </Text>
          </View>

          <View style={styles.actionWrapper}>
            {projectMeta.ownerId === userId ? (
              <TouchableOpacity
                onPress={handleArchiveProject}
                accessibilityLabel="Archive this project"
                style={styles.actionButton}
              >
                <Archive size={18} color="#FFA500" />
                <Text style={styles.actionText}>Archive</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleLeaveProject}
                accessibilityLabel="Leave this project"
                style={styles.actionButton}
              >
                <LogOut size={18} color="#FFA500" />
                <Text style={styles.actionText}>Leave</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ✅ Tasks List */}
      {loadingTasks ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <TaskList
          tasks={tasks}
          navigation={navigation}
          onToggleTaskStatus={handleToggleTaskStatus}
          projectUsers={projectUsers}
          title="All Tasks"
          showSeeMore={false}
          rightAction={
            <TouchableOpacity
              onPress={() => setAddTaskModalVisible(true)}
              accessibilityLabel="Add Task"
              style={styles.iconButton}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />
      )}

      {/* ✅ Activity Feed */}
      {loadingActivities ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <ActivityList
          activities={activities}
          navigation={navigation}
          title="All Activities"
          showSeeMore={false}
          filtersEnabled
        />
      )}
    </View>
  );

  return (
    <GradientBackground>
      <TopBar title={projectMeta.name || "Project"} />

      <FlatList
        data={[]}
        renderItem={null}
        keyExtractor={() => "static-header"}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ✅ Add Task Modal */}
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onTaskAdded={fetchTasks}
        projectId={projectId}
        projectUsers={projectUsers}
      />

      <EditProjectModal
        visible={editModalVisible}
        project={{ ...projectMeta, id: projectId }}
        onClose={() => {
          setEditModalVisible(false);
          fetchProjectInfo();
        }}
      />

      <AddUserModal
        visible={addUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={fetchUsers}
        projectId={projectId}
      />

      <BottomBar navigation={navigation} activeScreen="ProjectDetail" />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  sharedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
  },
  actionWrapper: {
    alignSelf: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#222",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "600",
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProjectDetailScreen;