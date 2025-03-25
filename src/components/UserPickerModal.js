import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useUser } from "../contexts/UserContext";

const { height, width } = Dimensions.get("window");

const UserPickerModal = ({ visible, onClose, onUserSelected, projectUsers }) => {
  console.log("📌 Received projectUsers in UserPickerModal:", projectUsers);

  const { userId, firstName } = useUser();
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // ✅ Store full user object

  // ✅ Process projectUsers into an array and set default selection
  useEffect(() => {
    console.log("📌 Current user:", firstName);

    if (Array.isArray(projectUsers)) {
      console.log("📌 Valid projectUsers array detected:", projectUsers);

      // ✅ Ensure the current user is always at the top of the list
      const sortedUsers = [
        { id: userId, name: firstName || "You" },
        ...projectUsers.filter((user) => user.id !== userId),
      ];

      console.log("📌 Sorted Users List:", sortedUsers);

      setUserList(sortedUsers);

      // ✅ Set initial selected user
      setSelectedUser(sortedUsers[0]);
    }
  }, [projectUsers, userId, firstName]);

  console.log("📌 Selected User:", selectedUser);

  // ✅ If modal is not visible, return null to prevent rendering
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select User</Text>

          {/* User selection list inside a scrollable container */}
          <View style={styles.pickerContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              snapToInterval={50}
              decelerationRate="fast"
              contentContainerStyle={styles.scrollViewContent}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.y / 50);
                if (userList[index]) {
                  setSelectedUser(userList[index]); // ✅ Correct: Updates selected user
                }
              }}
            >
              {userList.map((user) => (
                <View key={user.id} style={styles.pickerItem}>
                  <Text
                    style={[
                      styles.pickerText,
                      selectedUser?.id === user.id && styles.selectedText,
                    ]}
                  >
                    {user.name} {/* ✅ Correct: Extract and display only user name */}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Confirm selection button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              if (selectedUser) {
                onUserSelected(selectedUser); // ✅ Pass { id, name } object
              }
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>Select</Text>
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ================== Styles ================== //
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#001524",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 20,
  },
  pickerContainer: {
    height: 90,
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#00334E",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 50,
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 18,
    color: "#BBB",
  },
  selectedText: {
    fontSize: 22,
    color: "#FFA500",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#001524",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFA500",
    fontSize: 16,
  },
});

export default UserPickerModal;