import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import API from "../../../services/api"; // adjust path if needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
type User = {
  name: string;
  email: string;
  role: string;
};
export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ✅ Fetch profile data
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (err: unknown) {
      let errorMessage = "Failed to load profile";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: any } }).response;
        errorMessage = response?.data ? String(response.data) : JSON.stringify(err);
      } else {
        errorMessage = String(err);
      }

      console.log(errorMessage);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login"); // adjust if needed
  };

  // ✅ Loading state
  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  // ✅ No user case
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },

  header: {
    backgroundColor: "#2ECC71",
    padding: 20,
    borderRadius: 20,
    marginTop: 30,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
  },

  label: {
    fontSize: 12,
    color: "gray",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 3,
  },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});