//================== ProjectsScreen.js ===========================//
// Displays a list of projects with tasks and management tools.
// Supports sharing, editing, deleting, and navigating to details.
//================================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  UserPlus,
  Edit,
  Trash,
  CheckSquare,
} from "lucide-react-native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";

import CreateProjectModal from "../components/modals/CreateProjectModal";
import AddUserModal from "../components/modals/AddUserModal";
import EditProjectModal from "../components/modals/EditProjectModal";

import { useProjectService } from "../services/projectService";
import { fetchTasksByProjectId } from "../services/taskService";
import { fetchUserNamesByIds } from "../services/authService";

import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const ProjectsScreen = ({ navigation }) => {
  // states for storing data from the database
  const [projects, setProjects] = useState([]);
  const [userNames, setUserNames] = useState({});
  // states for communicating information to the user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // states for storing which project we are interacting with
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  // states for storing modal visibility
  const [isFormVisible, setFormVisible] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isEditProjectModalVisible, setEditProjectModalVisible] = useState(false);

  const { userId } = useUser();
  const { fetchProjects, deleteProject, addUserToProject } = useProjectService();

  // load projects on first render
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // set loading to true
      setLoading(true);
      // grab the project data
      const projectData = await fetchProjects(userId);
      // we then want to add the tasks to the project details
      const enrichedProjects = await Promise.all(
        projectData.map(async (project) => {
          const tasks = await fetchTasksByProjectId(project.id);
          return { ...project, tasks: tasks.slice(0, 4) };
        })
      );
      setProjects(enrichedProjects);
      // then grab all unique userids
      const allUserIds = enrichedProjects.flatMap((p) => p.sharedWith || []);
      // and then grab all their first names
      const names = await fetchUserNamesByIds(allUserIds);
      setUserNames(names);
    } catch (err) {
      Alert.alert("Error loading projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };
  // when the add user modal is open, we set which project
  // we are currently interacting with
  const openAddUserModal = (projectId) => {
    setSelectedProjectId(projectId);
    setAddUserModalVisible(true);
  };

  const handleUserAdded = async (email) => {
    if (!selectedProjectId) {
      Alert.alert("Error", "No project selected.");
      return;
    }
    try {
      // use the helper function to add a new user the project
      await addUserToProject(selectedProjectId, email);
      Alert.alert("Success", "User added successfully!");
      // then reload the information to pick up the change
      await loadProjects();
    } catch (error) {
      Alert.alert("Error", error.message || "Could not add user to project");
    } finally {
      // reset the states
      setSelectedProject(null);
      setAddUserModalVisible(false);
    }
  };
  // for when the user wants to delete a project
  const confirmDeleteProject = (projectId, projectName) => {
    Alert.alert(
      "Delete Project",
      `Are you sure you want to delete "${projectName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProject(projectId);
            loadProjects();
          },
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <TopBar title="Your Projects" />
      <View style={GlobalStyles.container.base}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : error ? (
          <Text style={GlobalStyles.text.translucent}>{error}</Text>
        ) : projects.length > 0 ? (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            contentContainerStyle={GlobalStyles.utility.flatListContent}
            renderItem={({ item }) => (
              <ProjectItem
                item={item}
                userNames={userNames}
                navigation={navigation}
                onAddUser={() => openAddUserModal(item.id)}
                onEdit={() => {
                  setSelectedProject(item);
                  setEditProjectModalVisible(true);
                }}
                onDelete={() => confirmDeleteProject(item.id, item.name)}
              />
            )}
          />
        ) : (
          <Text style={GlobalStyles.text.translucent}>No projects found.</Text>
        )}
      </View>
      <BottomBar
        navigation={navigation}
        activeScreen="Projects"
        setFormVisible={setFormVisible}
      />
      <CreateProjectModal
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        userId={userId}
      />
      <AddUserModal
        visible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={handleUserAdded}
      />
      <EditProjectModal
        visible={isEditProjectModalVisible}
        project={selectedProject}
        onClose={() => {
          setEditProjectModalVisible(false);
          loadProjects();
        }}
      />
    </GradientBackground>
  );
};

// reusable project item component
const ProjectItem = ({ item, userNames, navigation, onAddUser, onEdit, onDelete }) => {
  return (
    <View style={GlobalStyles.layout.container}>
      {/* 🔠 Project Title & Actions */}
      <View style={GlobalStyles.layout.header}>
        <Text style={GlobalStyles.layout.title}>{item.name}</Text>
        <View style={GlobalStyles.nav.iconRow}>
          <TouchableOpacity onPress={onAddUser} accessibilityLabel="Add user to project">
            <UserPlus color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} accessibilityLabel="Edit project">
            <Edit color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} accessibilityLabel="Delete project">
            <Trash color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={GlobalStyles.text.translucent}>
        {item.sharedWith?.length
          ? `Shared with: ${item.sharedWith.map((id) => userNames[id] || id).join(", ")}`
          : "Not shared"}
      </Text>
      {item.tasks.length > 0 ? (
        item.tasks.map((task, index) => (
          <View key={index} style={GlobalStyles.layout.listItem}>
            <CheckSquare color="#FFA500" size={18} />
            <Text style={[GlobalStyles.text.white, { paddingLeft: 10 }]}>
              {task.name}
            </Text>
          </View>
        ))
      ) : (
        <Text style={GlobalStyles.text.translucent}>No tasks yet</Text>
      )}
      <TouchableOpacity
        style={GlobalStyles.layout.seeMore}
        onPress={() =>
          navigation.navigate("ProjectDetail", {
            projectId: item.id,
            projectName: item.name,
          })
        }
        accessibilityLabel={`See more details for project ${item.name}`}
      >
        <Text style={GlobalStyles.text.highlight}>See More →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectsScreen;