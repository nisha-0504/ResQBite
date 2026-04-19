import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet, // Added this back - this was your main error!
} from "react-native";
import { getStats, saveData } from "../../../utils/storage";

interface User {
  name: string;
  phone: string;
  location: string;
  vehicle: string;
  rating: number;
  joined: string;
  verified: boolean;
  deliveries: number;
  meals: number;
  people: number;
  email: string;
  age: number;
  gender: string;
  address: string;
}

type UserKey = keyof User;

export default function Profile() {
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [user, setUser] = useState<User>({
    name: "Raj",
    phone: "+91 9876543210",
    email: "raj@gmail.com",
    age: 21,
    gender: "Male",
    address: "Bangalore, Karnataka",
    verified: true,
    location: "Bangalore",
    vehicle: "Bike",
    deliveries: 0,
    meals: 0,
    people: 0,
    rating: 4.8,
    joined: "Jan 2026",
  });

  const fields: { key: UserKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "vehicle", label: "Vehicle" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
  ];

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        const stats = await getStats();
        setUser((prev) => ({
          ...prev,
          deliveries: stats.deliveries,
          meals: stats.meals,
          people: stats.people,
        }));
      };
      loadStats();
    }, [])
  );

  const handleSave = async () => {
    await saveData("USER", user);
    setModalVisible(false);
  };

  const handleLogout = () => router.replace("/login");

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={styles.profileImg}
          />
          <Text style={styles.headerName}>{user.name}</Text>
        </View>

        {/* DETAILS */}
        <View style={styles.detailsCard}>
          {/* NAME */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
          </View>

          {/* PHONE */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
          </View>

          {/* LOCATION */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{user.location}</Text>
            </View>
          </View>

          {/* VEHICLE */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="bicycle-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={styles.label}>Vehicle</Text>
              <Text style={styles.value}>{user.vehicle}</Text>
            </View>
          </View>
        </View>

        {/* SMALL STATS */}
        <View style={styles.smallStatsRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallValue}>⭐ {user.rating}</Text>
            <Text style={styles.smallLabel}>Rating</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallValue}>📅 {user.joined}</Text>
            <Text style={styles.smallLabel}>Joined</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={[styles.smallValue, { color: "#2ECC71" }]}>
              {user.verified ? "Verified" : "Pending"}
            </Text>
            <Text style={styles.smallLabel}>Status</Text>
          </View>
        </View>

        {/* IMPACT */}
        <Text style={styles.sectionTitle}>Your Impact ⭐</Text>
        <View style={styles.impactRow}>
          {[
            { label: "Deliveries", value: user.deliveries },
            { label: "Meals", value: user.meals },
            { label: "People", value: user.people },
          ].map((item, index) => (
            <View key={index} style={styles.impactCard}>
              <Text style={styles.impactValue}>{item.value}</Text>
              <Text style={styles.impactLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ACTIONS */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <Pressable onPress={() => setModalVisible(true)} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={20} color="#2ECC71" />
          <Text style={styles.actionBtnText}>Edit Profile</Text>
        </Pressable>

        <Pressable onPress={() => setLogoutVisible(true)} style={styles.actionBtn}>
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={[styles.actionBtnText, { color: "red" }]}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* MODAL EDIT */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {fields.map((field) => (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}:</Text>
                  <TextInput
                    value={String(user[field.key])}
                    onChangeText={(text) =>
                      setUser({
                        ...user,
                        [field.key]: field.key === "age" ? Number(text) : text,
                      })
                    }
                    style={styles.inputBox}
                  />
                </View>
              ))}
            </ScrollView>
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL LOGOUT */}
      <Modal visible={logoutVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={{ color: "#6B7280", marginBottom: 20 }}>
              Are you sure you want to logout?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Pressable
                onPress={() => setLogoutVisible(false)}
                style={[styles.modalBtn, { backgroundColor: "#E5E7EB" }]}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setLogoutVisible(false);
                  handleLogout();
                }}
                style={[styles.modalBtn, { backgroundColor: "#EF4444" }]}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2ECC71",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  profileImg: { width: 80, height: 80, borderRadius: 40, marginTop: 10 },
  headerName: { color: "#fff", fontSize: 18, marginTop: 10 },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    elevation: 3,
  },
  detailRow: { flexDirection: "row", marginBottom: 15, alignItems: 'center' },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  label: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 16, fontWeight: "bold", color: "#1F2933" },
  smallStatsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 15, 
    marginHorizontal: 15 
  },
  smallCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    width: "31%",
    alignItems: "center",
    elevation: 2,
  },
  smallValue: { fontWeight: "bold", fontSize: 14 },
  smallLabel: { fontSize: 10, color: "#6B7280" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginLeft: 15 },
  impactRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10, 
    marginHorizontal: 15 
  },
  impactCard: {
    backgroundColor: "#2ECC71",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    width: "30%",
  },
  impactValue: { color: "#fff", fontWeight: "bold" },
  impactLabel: { color: "#E5E7EB", fontSize: 12 },
  actionBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  actionBtnText: { marginLeft: 10, fontWeight: '500' },
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    margin: 20, 
    padding: 20, 
    borderRadius: 16, 
    backgroundColor: "#fff" 
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  inputGroup: { marginTop: 15 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  modalBtn: { 
    flex: 1, 
    marginHorizontal: 5, 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center" 
  },
});