import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function History() {
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // 🔥 LOAD REAL HISTORY
  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const res = await fetch("http://192.168.0.101:5000/api/volunteer/history");
          const data = await res.json();

          // latest first
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
          );

          setHistoryData(sorted);
        } catch (err) {
          console.error("Failed to fetch history:", err);
        }
      };

      loadHistory();
    }, [])
  );
  const styles = {
    detailContainer: {
      marginTop: 12,
    },

    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    key: {
      fontWeight: "600",
      color: "#374151",
    },

    value: {
      color: "#6B7280",
    },
  };
  // 🔍 SEARCH
  const filteredData = historyData.filter((item) =>
    (item.restaurant || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.ngo || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.completedAt || "").toLowerCase().includes(search.toLowerCase())
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

        {/* SEARCH */}
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

          {/* EMPTY STATE */}
          {filteredData.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No deliveries yet
            </Text>
          )}

          {/* LIST */}
          {filteredData.map((item, index) => (
            <Pressable
              key={index}
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
              <Text style={{ fontWeight: "bold" }}>
                {item.restaurant} → {item.ngo}
              </Text>

              <Text style={{ color: "#6B7280", marginTop: 5 }}>
                {item.distance} km • ₹{item.earnings || 0}
              </Text>

              <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                {new Date(item.completedAt).toLocaleString("en-GB")}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* MODAL */}
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

            {/* DETAILS */}
            <View style={styles.detailContainer}>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Pickup:</Text>
                <Text style={styles.value}>{selectedTask?.restaurant}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Delivery:</Text>
                <Text style={styles.value}>{selectedTask?.ngo}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Distance:</Text>
                <Text style={styles.value}>{selectedTask?.distance} km</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Earnings:</Text>
                <Text style={styles.value}>₹{selectedTask?.earnings || 0}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Date:</Text>
                <Text style={styles.value}>
                  {selectedTask?.completedAt
                    ? new Date(selectedTask.completedAt).toLocaleString()
                    : "-"}
                </Text>
              </View>
            </View>

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
      </Modal >
    </View >
  );
}