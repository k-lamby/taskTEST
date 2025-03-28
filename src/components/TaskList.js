//================== TaskList.js ===========================//
// Pure presentational component that displays tasks
// Toggles task status via handler from parent
//==========================================================//

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { CheckCircle, Circle } from "lucide-react-native";
import GlobalStyles from "../styles/styles";
import { formatDateFirestoreJs } from "../utils/dateUtils";
import TaskDetailModal from "./TaskDetailModal"; // ✅ Import the modal

/**
 * TaskList Component
 * Props:
 * - tasks: Array of task objects
 * - navigation: React Navigation object
 * - onToggleTaskStatus: function(taskId, currentStatus)
 * - projectUsers: Array of users for the project (required for modal)
 */
const TaskList = ({ tasks, navigation, onToggleTaskStatus, projectUsers = [] }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Open modal for a specific task
  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <View style={GlobalStyles.sectionContainer}>
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>Featured Tasks</Text>
      </View>

      {tasks.length === 0 ? (
        <Text style={GlobalStyles.translucentText}>No tasks found.</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => {
            const isCompleted = item.status === "completed";
            const TaskIcon = isCompleted ? CheckCircle : Circle;

            return (
              <View style={styles.taskRow}>
                {/* Checkbox toggle button */}
                <TouchableOpacity
                  onPress={() => onToggleTaskStatus(item.id, item.status)}
                  accessibilityLabel={`Mark task "${item.name}" as ${
                    isCompleted ? "pending" : "completed"
                  }`}
                  accessible={true}
                  style={styles.checkboxWrapper}
                >
                  <TaskIcon
                    color={isCompleted ? "#4CAF50" : "#999"}
                    size={22}
                  />
                </TouchableOpacity>

                {/* Task Title opens modal */}
                <TouchableOpacity
                  onPress={() => openTaskModal(item)}
                  style={styles.taskTitleWrapper}
                  accessibilityLabel={`Open task details for ${item.name}`}
                  accessible={true}
                >
                  <Text
                    style={[
                      GlobalStyles.normalText,
                      styles.taskTitle,
                      isCompleted && styles.completedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>

                {/* Due date */}
                <Text
                  style={styles.dueDateText}
                  accessibilityLabel={`Due date: ${formatDateFirestoreJs(item.dueDate)}`}
                >
                  {formatDateFirestoreJs(item.dueDate)}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* "See More" button */}
      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate("Tasks")}
        accessibilityLabel="See more tasks"
        accessible={true}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>

      {/* ✅ Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          visible={modalVisible}
          onClose={closeModal}
          onUpdateTask={() => {}}
          projectUsers={projectUsers}
        />
      )}
    </View>
  );
};

export default TaskList;

// ================== Local Styles ================== //
const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxWrapper: {
    padding: 3,
  },
  taskTitleWrapper: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  taskTitle: {
    flexShrink: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  dueDateText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    minWidth: 60,
  },
});