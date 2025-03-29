//================== User Picker Modal.js =======================//
// this takes a list of user ids and users, and displays a list
// that allows the user to select from.
//==============================================================//
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
  // states for handling the current user details, and the form information
  const { userId, firstName } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // make sure the user array is sorted to have the current user always on top
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
          <Text
            style={[GlobalStyles.text.headerLg, { marginBottom: 16 }]}
            accessibilityRole="header"
            accessibilityLabel="Select a user to assign task"
          >
            Select User
          </Text>

          {/* scrollable list of users to select */}
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {/* plot each user component */}
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