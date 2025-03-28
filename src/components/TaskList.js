//=======================================================//
// TaskList.js
// Reusable component to display a list of tasks
// across one or many projects.
// Integrates GlobalStyles for consistency and accessibility.
//=======================================================//

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
import TaskDetailModal from "./modals/TaskDetailModal";

const TaskList = ({
  tasks = [],
  navigation,
  onToggleTaskStatus,
  title = "Featured Tasks",
  showSeeMore = true,
  rightAction = null,
  projectUsers = [],
  projectUsersMap = null,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return GlobalStyles.priority.high;
      case "medium":
        return GlobalStyles.priority.medium;
      case "low":
        return GlobalStyles.priority.low;
      default:
        return {};
    }
  };

  return (
    <View style={GlobalStyles.layout.container}>
      {/* 🔠 Section Header */}
      <View style={GlobalStyles.layout.header}>
        <Text style={GlobalStyles.layout.title}>{title}</Text>
        {rightAction}
      </View>

      {/* 📋 Task List or Empty State */}
      {tasks.length === 0 ? (
        <Text style={GlobalStyles.text.translucent}>No tasks found.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isCompleted = item.status === "completed";
            const TaskIcon = isCompleted ? CheckCircle : Circle;

            return (
              <View style={GlobalStyles.layout.listItem}>
                {/* 🏳️ Priority Flag */}
                <View
                  style={[styles.priorityFlag, getPriorityStyle(item.priority)]}
                  accessibilityLabel={`Priority: ${item.priority}`}
                  accessible
                />

                {/* ✅ Status Checkbox */}
                <TouchableOpacity
                  onPress={() => onToggleTaskStatus(item.id, item.status)}
                  accessibilityLabel={`Mark task "${item.name}" as ${isCompleted ? "pending" : "completed"}`}
                  style={styles.checkboxWrapper}
                >
                  <TaskIcon
                    color={isCompleted ? "#4CAF50" : "#999"}
                    size={18}
                  />
                </TouchableOpacity>

                {/* 🔤 Task Title */}
                <TouchableOpacity
                  onPress={() => openTaskModal(item)}
                  style={styles.taskTitleWrapper}
                  accessibilityLabel={`Open task details for ${item.name}`}
                >
                  <Text
                    style={[
                      GlobalStyles.text.white,
                      styles.taskTitle,
                      isCompleted && styles.completedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>

                {/* 🗓 Due Date */}
                <Text
                  style={GlobalStyles.text.translucentSmall}
                  accessibilityLabel={`Due date: ${formatDateFirestoreJs(item.dueDate)}`}
                >
                  {formatDateFirestoreJs(item.dueDate)}
                </Text>
              </View>
            );
          }}
        />
      )}

      {/* 🔗 See More CTA */}
      {showSeeMore && (
        <TouchableOpacity
          style={GlobalStyles.layout.seeMore}
          onPress={() => navigation.navigate("Tasks")}
          accessibilityLabel="See more tasks"
        >
          <Text style={GlobalStyles.text.highlight}>See More →</Text>
        </TouchableOpacity>
      )}

      {/* 🪟 Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          visible={modalVisible}
          onClose={closeModal}
          onUpdateTask={() => {}}
          projectUsers={
            projectUsersMap
              ? projectUsersMap[selectedTask.projectId] || []
              : projectUsers
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxWrapper: {
    padding: 3, // Ensures touchable area is large enough
  },
  taskTitleWrapper: {
    flex: 1,
    paddingLeft: 5,
    justifyContent: "center",
  },
  taskTitle: {
    flexShrink: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  priorityFlag: {
    width: 6,
    height: 20,
    borderRadius: 3,
    marginRight: 6,
  },
});

export default TaskList;