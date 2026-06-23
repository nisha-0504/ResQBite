import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ViewStyle } from "react-native";
import { BASE_URL } from "../../../config";
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
  Pressable,
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
  const [user, setUser] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const profileData = await profileRes.json();
          console.log("PROFILE DATA:", profileData);
          const res = await fetch(`${BASE_URL}/api/volunteer/history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();

          const deliveries = data.length;
          const storedUser = await AsyncStorage.getItem("user");

          setUser(profileData);
          const meals = data.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0,
          );

          const earnings = data.reduce(
            (sum: number, item: any) => sum + (item.earnings || 0),
            0,
          );

          const people = Math.floor(meals / 2);

          setUser((prev: any) => ({
            ...(prev || {}),
            deliveries,
            meals,
            earnings,
          }));
        } catch (err) {
          console.error("Failed to load stats:", err);
        }
      };

      loadStats();
    }, []),
  );

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: user?.name,
          phone: user?.phone,
          address: user?.address,
          gender: user?.gender,
          age: user?.age,
          vehicleType: user?.vehicleType,
        }),
      });

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);
      setUser(data.user);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = () => router.replace("/login");

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>        
        <View
          style={{
            backgroundColor: "#2ECC71",
            padding: 20,
            paddingTop: 40,
            minHeight: 140,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 15,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              marginTop: 10,
            }}
          >            
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
                {user?.name?.[0] || "U"}
              </Text>
            </View>            
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: "600",
                }}
              >
                {user?.name || "Volunteer"}
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
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 15,
            marginTop: 15,
            marginHorizontal: 10,
            elevation: 3,
          }}
        >         
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="person-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Name</Text>
              <Text style={value}>{user?.name || "Volunteer"}</Text>{" "}
            </View>
          </View>          
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="call-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Phone</Text>
              <Text style={value}>{user?.phone || "Not added"}</Text>
            </View>
          </View>          
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={iconBox}>
              <Ionicons name="location-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Location</Text>
              <Text style={value}>{user?.address || "Not added"}</Text>
            </View>
          </View>          
          <View style={{ flexDirection: "row" }}>
            <View style={iconBox}>
              <Ionicons name="bicycle-outline" size={20} color="#2ECC71" />
            </View>
            <View>
              <Text style={label}>Vehicle</Text>
              <Text style={value}>{user?.vehicleType || "Not added"}</Text>
            </View>
          </View>
        </View>       
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 15,
            marginHorizontal: 10,
          }}
        >
          <View style={smallCard}>
            <Text style={smallValue}>⭐ {user?.rating || 0}</Text>
            <Text style={smallLabel}>Rating</Text>
          </View>
          <View style={smallCard}>
            <Text style={smallValue}>📅 {user?.joined || "-"}</Text>
            <Text style={smallLabel}>Joined</Text>
          </View>
          <View style={smallCard}>
            <Text style={[smallValue, { color: "#2ECC71" }]}>
              {user?.verified ? "Verified" : "Pending"}
            </Text>
            <Text style={smallLabel}>Status</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 20,
            marginHorizontal: 10,
          }}
        >
          Your Impact ⭐
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          {[
            { label: "Deliveries", value: user?.deliveries || 0 },
            { label: "Meals", value: user?.meals || 0 },
            { label: "Earnings", value: `₹${user?.earnings || 0}` },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#2ECC71",
                padding: 15,
                borderRadius: 16,
                alignItems: "center",
                width: "30%",
              }}
            >
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
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {item.value}
              </Text>
              <Text style={{ color: "#fff" }}>{item.label}</Text>
            </View>
          ))}
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 20,
            marginHorizontal: 10,
          }}
        >
          Actions
        </Text>
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
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Edit Profile</Text>
        </Pressable>
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  margin: 20,
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Edit Profile
                </Text>

                {[
                  { key: "name", label: "Name" },
                  { key: "birthday", label: "Birthday (e.g. DD-MM-YYYY)" },
                  { key: "phone", label: "Phone" },
                  { key: "vehicleType", label: "Vehicle (e.g. Bike, Car)" },
                  { key: "vehicleNumber", label: "Vehicle Number" },
                  { key: "email", label: "Email" },
                  { key: "age", label: "Age" },
                  {
                    key: "gender",
                    label: "Gender (e.g. Female, Male, Others)",
                  },
                  { key: "address", label: "Address" },
                ].map((field) => (
                  <View key={field.key} style={styles.inputGroup}>
                    <Text style={styles.label}>{field.label}:</Text>

                    <TextInput
                      value={String(
                        user?.[field.key as keyof typeof user] || "",
                      )}
                      onChangeText={(text) =>
                        setUser((prev: any) => ({
                          ...(prev || {}),
                          [field.key as keyof typeof user]:
                            field.key === "age" ? Number(text) : text,
                        }))
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
                  }}
                >
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              margin: 20,
              padding: 20,
              borderRadius: 16,
              backgroundColor: "#fff",
            }}
          >
            
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Confirm Logout
            </Text>

            
            <Text style={{ color: "#6B7280" }}>
              Are you sure you want to logout?
            </Text>

            
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
             
              <Pressable
                onPress={() => setLogoutVisible(false)}
                style={{
                  flex: 1,
                  marginRight: 10,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#E5E7EB",
                }}
              >
                <Text>Cancel</Text>
              </Pressable>

              
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
                  backgroundColor: "#EF4444",
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
    </View>
  );
}
