//================== ProjectsScreen.js ===========================//
// This screen displays all projects associated with the user. 
// Users can view projects, tasks, and manage project settings.
//================================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { UserPlus, Edit, Trash, CheckSquare } from "lucide-react-native";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import useProjectService from "../services/projectService";
import { fetchTasksByProjectId } from "../services/taskService";
import { fetchUserNamesByIds } from "../services/authService";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const { userId } = useUser();
  const { fetchProjects } = useProjectService();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjects();

        // Fetch tasks for each project and limit to 4 per project
        const projectsWithTasks = await Promise.all(
          projectData.map(async (project) => {
            const tasks = await fetchTasksByProjectId(project.id);
            return { ...project, tasks: tasks.slice(0, 4) };
          })
        );

        setProjects(projectsWithTasks);

        // Fetch user names for shared users
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

    loadProjects();
  }, [fetchProjects]);

  return (
    <GradientBackground>
      {/* Top navigation bar */}
      <TopBar title="Your Projects" />

      <View style={GlobalStyles.container}>
        {/* Projects Section */}
        {loading ? (
          <ActivityIndicator size="medium" color="#ffffff" />
        ) : error ? (
          <Text style={GlobalStyles.translucentText}>{error}</Text>
        ) : projects.length > 0 ? (
          <FlatList
            data={projects}
            renderItem={({ item }) => (
              <ProjectItem item={item} userNames={userNames} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={GlobalStyles.flatListContent}
          />
        ) : (
          <Text style={GlobalStyles.translucentText}>No projects found.</Text>
        )}
      </View>

      {/* Bottom navigation bar */}
      <BottomBar navigation={navigation} activeScreen="Projects" setFormVisible={setFormVisible} />

      {/* Create Project Modal */}
      <CreateProjectModal visible={isFormVisible} onClose={() => setFormVisible(false)} userId={userId} />
    </GradientBackground>
  );
};

// =================== Reusable Project Item Component =================== //
const ProjectItem = ({ item, userNames, navigation }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      {/* Project Header */}
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{item.name}</Text>

        {/* Icons for Add User, Edit, Delete */}
        <View style={GlobalStyles.tightIconContainer}>
          <TouchableOpacity accessibilityLabel="Add user to project" accessible={true}>
            <UserPlus color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Edit project" accessible={true}>
            <Edit color="#FFFFFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Delete project" accessible={true}>
            <Trash color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shared Users */}
      <Text style={[GlobalStyles.translucentText, { paddingBottom: 10 }]}>
        {item.sharedWith && item.sharedWith.length > 0
          ? `Shared with: ${item.sharedWith.map((id) => userNames[id] || id).join(", ")}`
          : "Not shared"}
      </Text>

      {/* Task List */}
      {item.tasks.length > 0 ? (
        item.tasks.map((task, index) => (
          <View key={index} style={GlobalStyles.listItem}>
            <Text style={GlobalStyles.normalText}>
            <CheckSquare color="#FFA500" size={18}/>
          </Text>
          <Text style={[GlobalStyles.normalText, { paddingLeft: 10 }]}>
            {task.name}
          </Text>
          </View>
          
        ))
      ) : (
        <Text style={GlobalStyles.noTasks}>No tasks yet</Text>
      )}

      {/* "See More" Link */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id, projectName: item.name })}
        accessibilityLabel={`See more details about ${item.name}`}
        accessible={true}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectsScreen;