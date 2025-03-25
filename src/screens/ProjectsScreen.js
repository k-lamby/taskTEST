//================== ProjectsScreen.js ===========================//
// This shows a summary of all the projects that have been shared with
// the user. It allows them share, edit and delete the project
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
import { UserPlus, Edit, Trash, CheckSquare } from "lucide-react-native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import AddUserModal from "../components/AddUserModal";
import EditProjectModal from "../components/EditProjectModal";

import { useProjectService } from "../services/projectService";
import { fetchTasksByProjectId } from "../services/taskService";
import { fetchUserNamesByIds } from "../services/authService";

import { useUser } from "../contexts/UserContext";

import GlobalStyles from "../styles/styles";

const ProjectsScreen = ({ navigation }) => {
  // State to manage projects, user names, loading status, and errors
  const [projects, setProjects] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // State to manage modals visibility
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isEditProjectModalVisible, setEditProjectModalVisible] = useState(false);

  const { userId } = useUser();
  const { fetchProjects, deleteProject, addUserToProject } = useProjectService();

  // load project data when the component mounts
  useEffect(() => {
    loadProjects();
  }, []);

  // function for getting the projects
  const loadProjects = async () => {
    try {
      //display loading icon
      setLoading(true);
      //
      const projectData = await fetchProjects(userId);

      // Fetch tasks for each project and limit preview to 4 tasks
      const projectsWithTasks = await Promise.all(
        projectData.map(async (project) => {
          const tasks = await fetchTasksByProjectId(project.id);
          return { ...project, tasks: tasks.slice(0, 4) };
        })
      );
      setProjects(projectsWithTasks);

      // Fetch usernames for sharedWith IDs
      const allUserIds = projectsWithTasks.flatMap((p) => p.sharedWith || []);
      const names = await fetchUserNamesByIds(allUserIds);
      setUserNames(names);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // little handler function, that opens the modal but also sets the 
  // selected project id
  const openAddUserModal = (projectId) => {
    setSelectedProjectId(projectId); 
    setAddUserModalVisible(true);
  };

  // here we handle adding a user through the add user modal
  // little validation here for the moment
  const handleUserAdded = async (userEmail) => {
    // check to make sure the project state id is present
    if (!selectedProjectId) {
      Alert.alert("Error", "No project selected.");
      return;
    }
  
    try {
      //add the user to the project and display a basic message
      await addUserToProject(selectedProjectId, userEmail);
      Alert.alert("Success", "User added successfully!");
      // then reload the projects to display the update information
      await loadProjects();
    } catch (error) {
      // otherwise feedback the error to the user
      Alert.alert("Error", error.message || "Could not add user to project");
    } finally {
      //then close the modal, and reset the state
      setSelectedProject(null)
      setAddUserModalVisible(false);
    }
  };

  // Prompt user to confirm deletion
  const confirmDeleteProject = (projectId, projectName) => {
    Alert.alert(
      "Delete Project",
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // delete the project and then reload new display
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

      <View style={GlobalStyles.container}>
        {loading ? (
          <ActivityIndicator size="medium" color="#ffffff" />
        ) : error ? (
          <Text style={GlobalStyles.translucentText}>{error}</Text>
        ) : projects.length > 0 ? (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            contentContainerStyle={GlobalStyles.flatListContent}
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
          <Text style={GlobalStyles.translucentText}>No projects found.</Text>
        )}
      </View>

      {/* Bottom navigation bar */}
      <BottomBar navigation={navigation} activeScreen="Projects" setFormVisible={setFormVisible} />

      {/* Modals for creating, editing, and sharing projects */}
      <CreateProjectModal visible={isFormVisible} onClose={() => setFormVisible(false)} userId={userId} />

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

// Reusable component for rendering individual projects
const ProjectItem = ({ item, userNames, navigation, onAddUser, onEdit, onDelete }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{item.name}</Text>

        {/* Icons for managing project */}
        <View style={GlobalStyles.tightIconContainer}>
          <TouchableOpacity accessibilityLabel="Add user to project" onPress={onAddUser}>
            <UserPlus color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Edit project" onPress={onEdit}>
            <Edit color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Delete project" onPress={onDelete}>
            <Trash color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Display shared users */}
      <Text style={[GlobalStyles.translucentText, { paddingBottom: 10 }]}>
        {item.sharedWith?.length
          ? `Shared with: ${item.sharedWith.map((id) => userNames[id] || id).join(", ")}`
          : "Not shared"}
      </Text>

      {/* Display tasks preview */}
      {item.tasks.length > 0 ? (
        item.tasks.map((task, index) => (
          <View key={index} style={GlobalStyles.listItem}>
            <CheckSquare color="#FFA500" size={18} />
            <Text style={[GlobalStyles.normalText, { paddingLeft: 10 }]}>{task.name}</Text>
          </View>
        ))
      ) : (
        <Text style={GlobalStyles.translucentText}>No tasks yet</Text>
      )}

      {/* Navigate to detailed project view */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id, projectName: item.name })}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectsScreen;