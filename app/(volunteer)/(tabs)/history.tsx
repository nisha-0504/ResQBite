import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function History() {
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ SAMPLE DATA
  const historyData = [
    {
      id: 1,
      food: "Veg Meals",
      quantity: 20,
      pickup: "A2B Restaurant",
      delivery: "Care NGO",
      distance: 2,
      date: "20 Mar, 6:00 PM",
      status: "Delivered",
      points: 50,
      address: "123 Main Street",
      notes: "Handled carefully",
      vehicle: "Bike",
    },
    {
      id: 2,
      food: "Pizza Boxes",
      quantity: 15,
      pickup: "Dominos",
      delivery: "Hope NGO",
      distance: 3,
      date: "19 Mar, 5:00 PM",
      status: "Delivered",
      points: 40,
      address: "456 City Road",
      notes: "Fragile boxes",
      vehicle: "Scooter",
    },
  ];

  // ✅ SEARCH FILTER
  const filteredData = historyData.filter((item) =>
    item.pickup.toLowerCase().includes(search.toLowerCase()) ||
    item.delivery.toLowerCase().includes(search.toLowerCase()) ||
    item.date.toLowerCase().includes(search.toLowerCase())
  );

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
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
            History
          </Text>
        </View>

        {/* SEARCH BAR */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search by NGO, Restaurant, Date"
              value={search}
              onChangeText={setSearch}
              style={{ marginLeft: 10, flex: 1 }}
            />
          </View>

          {/* HISTORY LIST */}
          {filteredData.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedTask(item);
                setModalVisible(true);
              }}
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 15,
                marginTop: 15,
                elevation: 3,
              }}
            >
              {/* MINIMAL CARD */}
              <Text style={{ fontWeight: "bold" }}>
                {item.pickup} → {item.delivery}
              </Text>

              <Text style={{ color: "#6B7280", marginTop: 5 }}>
                Distance: {item.distance} km
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* MODAL (FULL DETAILS) */}
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
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Delivery Details
              </Text>

              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            {/* FULL DETAILS */}
            <Text style={{ marginTop: 10 }}>
              🍱 Food: {selectedTask?.food}
            </Text>
            <Text>📦 Quantity: {selectedTask?.quantity}</Text>
            <Text>🍽 Pickup: {selectedTask?.pickup}</Text>
            <Text>🏠 Delivery: {selectedTask?.delivery}</Text>
            <Text>📍 Distance: {selectedTask?.distance} km</Text>
            <Text>📅 Date: {selectedTask?.date}</Text>
            <Text>📌 Address: {selectedTask?.address}</Text>
            <Text>📝 Notes: {selectedTask?.notes}</Text>
            <Text>🚲 Vehicle: {selectedTask?.vehicle}</Text>

            {/* CLOSE BUTTON */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 15,
                backgroundColor: "#2ECC71",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}