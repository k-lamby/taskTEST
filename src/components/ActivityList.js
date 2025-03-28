//================== ActivityList.js ===========================//
// Displays a list of recent activities. Reusable across the app.
// Shows modal previews for messages and zoomable previews for files.
//==============================================================//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import GlobalStyles from "../styles/styles";
import { getActivityIcon } from "../utils/iconUtils";
import { formatDateFirestoreJs } from "../utils/dateUtils";
import { fetchUserNamesByIds } from "../services/authService";
import ActivityInfoModal from "./modals/ActivityInfoModal";

// Character limit for activity content preview
const CHARACTER_LIMIT = 20;

const ActivityList = ({
  activities,
  navigation,
  title = "Recent Activities",
  filtersEnabled = false,
}) => {
  const [userNames, setUserNames] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activeTab, setActiveTab] = useState("collab");

  // ===================== Filter Tabs ===================== //
  const tabs = [
    { key: "all", label: "All" },
    { key: "status", label: "Status Update" },
    { key: "collab", label: "Files & Messages" },
  ];

  const isTypeMatch = (type, tab) => {
    switch (tab) {
      case "all":
        return true;
      case "status":
        return type === "status" || type === "create";
      case "collab":
        return ["file", "image", "message", "comment"].includes(type);
      default:
        return true;
    }
  };

  const filteredActivities = activities.filter((a) =>
    isTypeMatch(a.type, activeTab)
  );

  // ================= Load User Display Names ================= //
  useEffect(() => {
    const loadUserNames = async () => {
      const uniqueUserIds = [
        ...new Set(activities.map((a) => a.userId).filter(Boolean)),
      ];
      if (uniqueUserIds.length === 0) return;

      try {
        const namesMap = await fetchUserNamesByIds(uniqueUserIds);
        setUserNames(namesMap);
      } catch (error) {
        console.error("❌ Failed to fetch user names:", error);
      }
    };

    loadUserNames();
  }, [activities]);

  // =================== Handle Activity Tap =================== //
  const handleActivityPress = (activity) => {
    const userName = userNames[activity.userId] || "Someone";

    switch (activity.type) {
      case "message":
      case "comment":
      case "status":
      case "create":
        setSelectedActivity({ ...activity, userName });
        setModalVisible(true);
        break;

      case "file":
      case "image":
        if (activity.fileUrl) {
          navigation.navigate("FilePreview", {
            fileUrl: activity.fileUrl,
            fileType: activity.type,
            fileName: activity.content || "Attachment",
          });
        }
        break;

      default:
        navigation.navigate("ActivityDetail", { activityId: activity.id });
    }
  };

  // ==================== Render Activity Row ==================== //
  const renderActivityItem = ({ item }) => {
    const displayName = userNames[item.userId] || "Someone";
    const projectName = item.title || "Unnamed Project";
    const date = formatDateFirestoreJs(item.timestamp);

    // Truncate content
    const truncatedContent =
      item.content && item.content.length > CHARACTER_LIMIT
        ? item.content.slice(0, CHARACTER_LIMIT) + "..."
        : item.content || "";

    return (
      <TouchableOpacity
        style={GlobalStyles.layout.listItem}
        onPress={() => handleActivityPress(item)}
        accessibilityLabel={`Activity in ${projectName} by ${displayName}: ${truncatedContent}`}
        accessible
      >
        {/* Icon */}
        <View style={styles.iconWrapper}>{getActivityIcon(item.type)}</View>

        {/* Message Content and Metadata */}
        <View style={styles.messageContainer}>
          <Text style={GlobalStyles.text.white}>{truncatedContent}</Text>

          <View style={styles.metaRow}>
            {/* Left-aligned project + user */}
            <View style={styles.metaLeft}>
              <Text style={GlobalStyles.text.translucentSmall}>By {displayName}</Text>
              <Text style={GlobalStyles.text.translucentSmall}>For: {projectName}</Text>
            </View>

            {/* Right-aligned timestamp */}
            <Text style={GlobalStyles.text.translucentSmall}>{date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={GlobalStyles.layout.container}>
      {/* Section Title */}
      <View style={GlobalStyles.layout.header}>
        <Text style={GlobalStyles.layout.title}>{title}</Text>
      </View>

      {/* Optional Filter Tabs */}
      {filtersEnabled && (
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={`Filter activities by ${tab.label}`}
              accessible
            >
              <Text
                style={[
                  GlobalStyles.text.white,
                  activeTab === tab.key && GlobalStyles.text.black,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Activity Feed */}
      {filteredActivities.length === 0 ? (
        <Text style={GlobalStyles.text.translucent}>No activities found.</Text>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal for viewing message/status details */}
      <ActivityInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        activity={selectedActivity}
      />
    </View>
  );
};

export default ActivityList;

//==============================================================//
// Component-Specific Styles
//==============================================================//

const styles = StyleSheet.create({

  iconWrapper: {
    marginTop: 4,
    marginRight: 8,
  },
  messageContainer: {
    flex: 1,
    paddingRight: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 3,
  },
  metaLeft: {
    flexShrink: 1,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  activeTabButton: {
    backgroundColor: "#FFA500",
  },
});