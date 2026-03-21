import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Raj",
    phone: "+91 9876543210",
    location: "Bangalore",
    vehicle: "Bike",
    role: "Volunteer",
    deliveries: 45,
    meals: 680,
    people: 500,
    points: 1250,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(false);
  };

  const handleLogout = () => {
    router.replace("/login"); // logout
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#2ECC71",
            padding: 20,
            paddingTop: 50,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Profile
          </Text>

          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginTop: 10,
            }}
          />

          <Text style={{ color: "#fff", fontSize: 18, marginTop: 10 }}>
            {user.name}
          </Text>
        </View>

        {/* BASIC DETAILS */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Details</Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 15,
              marginTop: 10,
              elevation: 3,
            }}
          >
            {/* NAME */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View
                style={{
                  backgroundColor: "#E8F5E9",
                  padding: 10,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              >
                <Ionicons name="person-outline" size={20} color="#2ECC71" />
              </View>

              <View>
                <Text style={{ color: "#6B7280" }}>Name</Text>
                <Text style={{ fontWeight: "bold" }}>{user.name}</Text>
              </View>
            </View>

            {/* PHONE */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View
                style={{
                  backgroundColor: "#E8F5E9",
                  padding: 10,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              >
                <Ionicons name="call-outline" size={20} color="#2ECC71" />
              </View>

              <View>
                <Text style={{ color: "#6B7280" }}>Phone</Text>
                <Text style={{ fontWeight: "bold" }}>{user.phone}</Text>
              </View>
            </View>

            {/* LOCATION */}
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View
                style={{
                  backgroundColor: "#E8F5E9",
                  padding: 10,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              >
                <Ionicons name="location-outline" size={20} color="#2ECC71" />
              </View>

              <View>
                <Text style={{ color: "#6B7280" }}>Location</Text>
                <Text style={{ fontWeight: "bold" }}>{user.location}</Text>
              </View>
            </View>

            {/* VEHICLE */}
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: "#E8F5E9",
                  padding: 10,
                  borderRadius: 50,
                  marginRight: 10,
                }}
              >
                <Ionicons name="bicycle-outline" size={20} color="#2ECC71" />
              </View>

              <View>
                <Text style={{ color: "#6B7280" }}>Vehicle</Text>
                <Text style={{ fontWeight: "bold" }}>{user.vehicle}</Text>
              </View>
            </View>
          </View>

          {/* IMPACT */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            Your Impact ⭐
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {[
              { label: "Deliveries", value: user.deliveries },
              { label: "Meals", value: user.meals },
              { label: "People", value: user.people },
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
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {item.value}
                </Text>
                <Text style={{ color: "#E5E7EB" }}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ACTIONS */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
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
              flexDirection: "row",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <Ionicons name="create-outline" size={20} color="#2ECC71" />
            <Text style={{ marginLeft: 10 }}>Edit Profile</Text>
          </Pressable>

          {/* LOGOUT */}
          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 15,
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={{ marginLeft: 10, color: "red" }}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
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
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Edit Profile
            </Text>

            <TextInput
              placeholder="Name"
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
              style={{ borderBottomWidth: 1, marginTop: 10 }}
            />

            <TextInput
              placeholder="Phone"
              value={user.phone}
              onChangeText={(text) => setUser({ ...user, phone: text })}
              style={{ borderBottomWidth: 1, marginTop: 10 }}
            />

            <TextInput
              placeholder="Location"
              value={user.location}
              onChangeText={(text) => setUser({ ...user, location: text })}
              style={{ borderBottomWidth: 1, marginTop: 10 }}
            />

            <TextInput
              placeholder="Vehicle"
              value={user.vehicle}
              onChangeText={(text) => setUser({ ...user, vehicle: text })}
              style={{ borderBottomWidth: 1, marginTop: 10 }}
            />

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
          </View>
        </View>
      </Modal>
    </View>
  );
}
