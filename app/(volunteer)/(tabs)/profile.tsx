import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ViewStyle } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable
} from "react-native";
const iconBox = {
  backgroundColor: "#E8F5E9",
  padding: 10,
  borderRadius: 50,
  marginRight: 10,
};

const label = { color: "#6B7280" };
const value = { fontWeight: "bold" as const };

const smallCard: ViewStyle = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  width: "30%",
  elevation: 3,
};
const styles = {
  inputGroup: {
    marginTop: 12,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },

  inputBox: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
};

const smallValue = {
  fontSize: 14,
  fontWeight: "bold" as const,
};
const smallLabel = { fontSize: 12, color: "#6B7280" };


export default function Profile() {
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [user, setUser] = useState({
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
    vehicleNumber: "KA021999", // ➕ ADDED
    birthday: "12-01-1996", // ➕ ADDED
    earnings: 0, // ➕ ADDED
  });

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          const res = await fetch("http://192.168.0.101:5000/api/volunteer/history");
          const data = await res.json();

          const deliveries = data.length;

          const meals = data.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
          );

          const earnings = data.reduce(
            (sum: number, item: any) => sum + (item.earnings || 0),
            0
          ); // ➕ ADDED

          const people = Math.floor(meals / 2); // simple assumption

          setUser((prev) => ({
            ...prev,
            deliveries,
            meals,
            earnings,
          }));
        } catch (err) {
          console.error("Failed to load stats:", err);
        }
      };

      loadStats();
    }, [])
  );

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userName", user.name.trim());
      console.log("Saved:", user.name);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = () => router.replace("/login");

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>

      <ScrollView>

        {/* HEADER */}
        <View style={{
          backgroundColor: "#2ECC71",
          padding: 20,
          paddingTop: 40,
          minHeight: 140,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          alignItems: "flex-start",
        }}>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 15, // ✅ keeps it centered
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              marginTop: 10,
            }}
          >
            {/* Profile Circle */}
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#E5E7EB",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 30, color: "#6B7280" }}>
                {user.name?.[0] || "U"}
              </Text>
            </View>

            {/* Name + small text */}
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: "600",
                }}
              >
                {user.name}
              </Text>

              <Text
                style={{
                  color: "#E5E7EB",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                Volunteer
              </Text>
            </View>
          </View>
        </View>

        {/* DETAILS */}
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 15,
          marginTop: 15,
          marginHorizontal: 10,
          elevation: 3,
        }}>

          {/* NAME */}
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="person-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Name</Text>
              <Text style={value}>{user.name}</Text>
            </View>
          </View>

          {/* PHONE */}
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="call-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Phone</Text>
              <Text style={value}>{user.phone}</Text>
            </View>
          </View>

          {/* LOCATION */}
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="location-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Location</Text>
              <Text style={value}>{user.location}</Text>
            </View>
          </View>

          {/* VEHICLE */}
          <View style={{ flexDirection: "row" }}>
            <View style={iconBox}>
              <Ionicons name="bicycle-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Vehicle</Text>
              <Text style={value}>{user.vehicle}</Text>
            </View>
          </View>

        </View>

        {/* SMALL STATS */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15, marginHorizontal: 10 }}>
          <View style={smallCard}>
            <Text style={smallValue}>⭐ {user.rating}</Text>
            <Text style={smallLabel}>Rating</Text>
          </View>

          <View style={smallCard}>
            <Text style={smallValue}>📅 {user.joined}</Text>
            <Text style={smallLabel}>Joined</Text>
          </View>

          <View style={smallCard}>
            <Text style={[smallValue, { color: "#2ECC71" }]}>
              {user.verified ? "Verified" : "Pending"}
            </Text>
            <Text style={smallLabel}>Status</Text>
          </View>
        </View>

        {/* IMPACT */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, marginHorizontal: 10 }}>
          Your Impact ⭐
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginHorizontal: 10 }}>
          {[
            { label: "Deliveries", value: user.deliveries },
            { label: "Meals", value: user.meals },
            { label: "Earnings", value: `₹${user.earnings}` },].map((item, index) => (
              <View key={index} style={{
                backgroundColor: "#2ECC71",
                padding: 15,
                borderRadius: 16,
                alignItems: "center",
                width: "30%",
              }}>
                <Ionicons
                  name={
                    item.label === "Deliveries"
                      ? "bicycle-outline"
                      : item.label === "Meals"
                        ? "restaurant-outline"
                        : "cash-outline"
                  }
                  size={18}
                  color="#fff"
                /> // ➕ ADDED
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.value}</Text>
                <Text style={{ color: "#fff" }}>{item.label}</Text>
              </View>
            ))}
        </View>

        {/* ACTIONS */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, marginHorizontal: 10 }}>
          Actions
        </Text>

        {/* EDIT PROFILE */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 15,
            marginTop: 10,
            marginHorizontal: 8,
            flexDirection: "row",
            alignItems: "center",
            elevation: 3,
          }}
        >
          <Ionicons name="create-outline" size={20} color="#2ECC71" />
          <Text style={{ marginLeft: 10, fontSize: 16 }}>
            Edit Profile
          </Text>
        </Pressable>

        {/* LOGOUT */}
        <Pressable
          onPress={() => setLogoutVisible(true)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 15,
            marginTop: 10,
            marginHorizontal: 8,
            flexDirection: "row",
            alignItems: "center",
            elevation: 3,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={{ marginLeft: 10, fontSize: 16, color: "red" }}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ margin: 20, padding: 20, borderRadius: 16, backgroundColor: "#fff" }}>

                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Edit Profile</Text>

                {[
                  { key: "name", label: "Name" },
                  { key: "birthday", label: "Birthday (e.g. DD-MM-YYY)" },
                  { key: "phone", label: "Phone" },
                  { key: "location", label: "Location" },
                  { key: "vehicle", label: "Vehicle (e.g. Bike, Car)" },
                  { key: "vehicleNumber", label: "Vehicle Number" },
                  { key: "email", label: "Email" },
                  { key: "age", label: "Age" },
                  { key: "gender", label: "Gender (e.g. Female, Male, Others)" },
                  { key: "address", label: "Address" },
                ].map((field) => (
                  <View key={field.key} style={styles.inputGroup}>

                    <Text style={styles.label}>{field.label}:</Text>

                    <TextInput
                      value={String(user[field.key as keyof typeof user])} onChangeText={(text) =>
                        setUser({
                          ...user,
                          [field.key as keyof typeof user]:
                            field.key === "age" ? Number(text) : text,
                        })
                      }
                    style={styles.inputBox}
                    />

                  </View>
                ))}

                <Pressable
                  onPress={handleSave}
                  style={{
                    marginTop: 15,
                    backgroundColor: "#2ECC71",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#fff" }}>Save</Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#E5E7EB",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#111827", fontWeight: "500" }}>
                    Close
                  </Text>
                </Pressable>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Modal visible={logoutVisible} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}>

          <View style={{
            margin: 20,
            padding: 20,
            borderRadius: 16,
            backgroundColor: "#fff"
          }}>

            {/* TITLE */}
            <Text style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10
            }}>
              Confirm Logout
            </Text>

            {/* MESSAGE */}
            <Text style={{ color: "#6B7280" }}>
              Are you sure you want to logout?
            </Text>

            {/* BUTTONS */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20
            }}>

              {/* CANCEL */}
              <Pressable
                onPress={() => setLogoutVisible(false)}
                style={{
                  flex: 1,
                  marginRight: 10,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#E5E7EB"
                }}
              >
                <Text>Cancel</Text>
              </Pressable>

              {/* LOGOUT */}
              <Pressable
                onPress={() => {
                  setLogoutVisible(false);
                  handleLogout();
                }}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#EF4444"
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Logout
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>
    </View >
  );
}
