import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("Helping Hands NGO");
  const [email, setEmail] = useState("ngo@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  const handleLogout = async () => {
    try {
      // 🧹 Clear stored data (role, token, etc.)
      await AsyncStorage.clear();

      // 🔄 Navigate to role selection
      router.replace("/login");
    } catch (e) {
      console.log("Logout error:", e);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity>
          <Feather name="settings" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>H</Text>
        </View>

        <Text style={styles.name}>Helping Hands NGO</Text>
        <Text style={styles.role}>NGO</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={18} color="#2fb463" />
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>ngo@email.com</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="call-outline" size={18} color="#2fb463" />
          </View>
          <View>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>+91 98765 43210</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={18} color="#2fb463" />
          </View>
          <View>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>123 Main Street, City Area</Text>
          </View>
        </View>
      </View>

      {/* Impact */}
      <View style={styles.impactCard}>
        <View style={styles.row}>
          <Ionicons name="ribbon-outline" size={18} color="#fff" />
          <Text style={styles.impactTitle}> Your Impact</Text>
        </View>

        <View style={styles.impactRow}>
          <View style={styles.impactBox}>
            <Text style={styles.impactNumber}>150</Text>
            <Text style={styles.impactLabel}>Meals</Text>
          </View>

          <View style={styles.impactBox}>
            <Text style={styles.impactNumber}>45kg</Text>
            <Text style={styles.impactLabel}>Food Saved</Text>
          </View>

          <View style={styles.impactBox}>
            <Text style={styles.impactNumber}>120</Text>
            <Text style={styles.impactLabel}>People</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text>🌟</Text>
          </View>
          <View style={styles.badge}>
            <Text>🏆</Text>
          </View>
          <View style={styles.badge}>
            <Text>💚</Text>
          </View>
          <View style={styles.badgeInactive}>
            <Text>🎯</Text>
          </View>
          <View style={styles.badgeInactive}>
            <Text>👑</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editProfileBtn}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="edit" size={18} color="#2fb463" />
        <Text style={styles.editProfileText}> Edit Profile</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.replace("/role")} // ✅ IMPORTANT
      >
        <MaterialIcons name="logout" size={18} color="red" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  header: {
    backgroundColor: "#2fb463",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  profileSection: {
    backgroundColor: "#2fb463",
    alignItems: "center",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2fb463",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  role: {
    color: "#e6ffe6",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  iconCircle: {
    backgroundColor: "#e6f7ee",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  label: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
  },

  value: {
    fontWeight: "600",
  },

  impactCard: {
    backgroundColor: "#2fb463",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
  },

  impactTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  impactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  impactBox: {
    alignItems: "center",
  },

  impactNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  impactLabel: {
    color: "#e6ffe6",
    fontSize: 12,
  },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  badge: {
    backgroundColor: "#ffe9d6",
    padding: 12,
    borderRadius: 10,
  },

  badgeInactive: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
  },

  editProfileBtn: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#2fb463",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  editProfileText: {
    color: "#2fb463",
    fontWeight: "bold",
  },

  logoutBtn: {
    margin: 20,
    borderWidth: 1.5,
    borderColor: "red",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  logoutText: {
    color: "red",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // 🔥 shaded background
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  saveBtn: {
    backgroundColor: "#2fb463",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
});
