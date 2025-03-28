//================== ActivityList.js ===========================//
// Displays a list of recent activities. Reusable across the app.
//================================================================//

import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FolderKanban } from "lucide-react-native";
import GlobalStyles from "../styles/styles";

const ActivityList = ({ activities, navigation }) => {
  return (
    <View style={GlobalStyles.sectionContainer}>
      <View style={GlobalStyles.sectionHeader}>
        <Text style={GlobalStyles.sectionTitle}>Recent Activities</Text>
      </View>

      {activities.length === 0 ? (
        <Text style={GlobalStyles.translucentText}>No activities found.</Text>
      ) : (
        <FlatList
          data={activities}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.listItem}
              onPress={() => navigation.navigate("ActivityDetail", { activityId: item.id })}
              accessibilityLabel={`Open activity: ${item.description}`}
              accessible={true}
            >
              <FolderKanban color="#007BFF" size={18} />
              <Text style={[GlobalStyles.normalText, { paddingLeft: 10 }]}>{item.description}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <TouchableOpacity
        style={GlobalStyles.seeMore}
        onPress={() => navigation.navigate("Activities")}
        accessibilityLabel="See more activities"
        accessible={true}
      >
        <Text style={GlobalStyles.seeMoreText}>See More →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActivityList;