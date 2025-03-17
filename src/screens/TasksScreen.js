import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import GradientBackground from "../components/GradientBackground"; 
import { fetchTasksWithSubtasksByOwner } from '../services/taskService'; // Import task fetching function

const TasksScreen = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const userId = route?.params?.userId || "defaultUserId"; // Ensure a user ID is available

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasksWithSubtasksByOwner(userId);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };
    loadTasks();
  }, [userId]);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <TopBar title="My Tasks" />
        
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.name}</Text>
              <Text style={styles.taskProject}>Project: {item.projectId || "No Project"}</Text>
              <Text style={styles.taskDescription}>{item.description || "No description available."}</Text>
              <Text style={styles.taskDueDate}>Due: {item.dueDate ? item.dueDate.toLocaleDateString() : "No due date"}</Text>
              <Text style={item.completed ? styles.completed : styles.pending}>
                {item.completed ? "✅ Completed" : "⏳ Pending"}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
        />

        <BottomBar navigation={navigation} activeScreen="Tasks" />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskProject: {
    fontSize: 14,
    color: '#666',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  taskDueDate: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  completed: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 6,
  },
  pending: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default TasksScreen;