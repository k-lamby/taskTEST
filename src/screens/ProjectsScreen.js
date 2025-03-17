import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import GradientBackground from "../components/GradientBackground";
import CreateProjectModal from "../components/CreateProjectModal";
import useProjectService from "../services/projectService"; // ✅ Corrected import
import { fetchTasksByProjectId } from "../services/taskService";
import { fetchUserNamesByIds } from "../services/authService";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Feather";

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const { userId, userEmail } = useUser();
  const { fetchProjects } = useProjectService(); // ✅ Corrected usage

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjects(); // ✅ No arguments needed

        // Fetch tasks for each project and get the top 4
        const projectsWithTasks = await Promise.all(
          projectData.map(async (project) => {
            const tasks = await fetchTasksByProjectId(project.id);
            return {
              ...project,
              tasks: tasks.slice(0, 4),
            };
          })
        );

        setProjects(projectsWithTasks);

         // ✅ Fetch user names for sharedWith users
         const allUserIds = projectsWithTasks.flatMap((p) => p.sharedWith || []);
         const names = await fetchUserNamesByIds(allUserIds);
         console.log(allUserIds)
         setUserNames(names);

      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [fetchProjects]); // ✅ Dependency on fetchProjects

  const renderProject = ({ item }) => (
    <View style={GlobalStyles.sectionContainer}>
      {/* Project Header */}
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>{item.name}</Text>

        {/* Icons for Add User, Edit, Delete */}
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Icon name="user-plus" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shared Users */}
      <Text style={GlobalStyles.translucentText}>
        {item.sharedWith && item.sharedWith.length > 0
          ? `Shared with: ${item.sharedWith.map((id) => userNames[id] || id).join(", ")}`
          : "Not shared"}
      </Text>

      {/* Task List */}
      {item.tasks.length > 0 ? (
        item.tasks.map((task, index) => (
          <Text key={index} style={GlobalStyles.listItem}>
            • {task.name}
          </Text>
        ))
      ) : (
        <Text style={styles.noTasks}>No tasks yet</Text>
      )}

      {/* "See More" Link */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() =>
          navigation.navigate("ProjectDetail", { projectId: item.id, projectName: item.name })
        }
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );

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
            renderItem={renderProject}
            keyExtractor={(item) => item.id}
            style={styles.projectList}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={GlobalStyles.translucentText}>No projects found.</Text>
        )}
      </View>

      {/* Bottom navigation bar */}
      <BottomBar
        navigation={navigation}
        activeScreen="Projects"
        setFormVisible={setFormVisible}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={isFormVisible}
        onClose={() => setFormVisible(false)}
        userId={userId}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  noTasks: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
    marginTop: 4,
  },
  flatListContent: {
    paddingTop: 3,
  },
});

export default ProjectsScreen;