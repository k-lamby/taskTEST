import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import GlobalStyles from "../../styles/styles";
import { useUser } from "../../contexts/UserContext";

const UserPickerModal = ({ visible, onClose, onUserSelected, projectUsers }) => {
  const { userId, firstName } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (Array.isArray(projectUsers)) {
      const sortedUsers = [
        { id: userId, name: firstName || "You" },
        ...projectUsers.filter(user => user.id !== userId),
      ];

      setUserList(sortedUsers);
      setSelectedUser(sortedUsers[0]);
    }
  }, [projectUsers, userId, firstName]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={GlobalStyles.modal.overlay}>
        <View style={GlobalStyles.modal.container}>
          {/* 🧑 Header */}
          <Text
            style={[GlobalStyles.text.headerLg, { marginBottom: 16 }]}
            accessibilityRole="header"
            accessibilityLabel="Select a user to assign task"
          >
            Select User
          </Text>

          {/* 👤 Scrollable User List */}
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {userList.map((user) => {
              const isSelected = selectedUser?.id === user.id;
              return (
                <Pressable
                  key={user.id}
                  onPress={() => setSelectedUser(user)}
                  accessibilityLabel={`Select ${user.name}`}
                  style={{
                    backgroundColor: isSelected ? "#FFA500" : "transparent",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? "#FFA500" : "#333",
                  }}
                >
                  <Text
                    style={[
                      GlobalStyles.text.white,
                      {
                        color: isSelected ? "#001524" : "#FFF",
                        fontWeight: isSelected ? "bold" : "normal",
                      },
                    ]}
                  >
                    {user.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ✅ Confirm Selection */}
          <TouchableOpacity
            onPress={() => {
              if (selectedUser) onUserSelected(selectedUser);
              onClose();
            }}
            style={[GlobalStyles.button.primary, { marginTop: 16 }]}
            accessibilityLabel="Confirm user selection"
          >
            <Text style={GlobalStyles.button.text}>Select</Text>
          </TouchableOpacity>

          {/* ❌ Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Cancel and close user picker"
          >
            <Text style={GlobalStyles.text.closeButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UserPickerModal;