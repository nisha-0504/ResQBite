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
  const [selectedTask, setSelectedTask] = useState<any>(null); // ✅ UPDATED
  const [modalVisible, setModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]); // ✅ UPDATED
  const [filter, setFilter] = useState("all");

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const res = await fetch("http://192.168.0.101:5000/api/volunteer/history");
          const data = await res.json();

          const sorted = [...data].sort(
            (a, b) =>
              new Date(b?.completedAt || 0).getTime() -
              new Date(a?.completedAt || 0).getTime() // ✅ UPDATED
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
    detailContainer: { marginTop: 12 },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    key: { fontWeight: "600", color: "#374151" },
    value: { color: "#6B7280" },
  } as const;

  // 🔍 SEARCH (SAFE)
  const filteredData = historyData.filter((item) => {
    const restaurant = item?.restaurant || "";
    const ngo = item?.ngo || "";

    // ✅ FORMAT DATE SAME AS UI
    const formattedDate = item?.completedAt
      ? new Date(item.completedAt).toLocaleString("en-GB")
      : "";

    const searchText = search.toLowerCase();

    return (
      restaurant.toLowerCase().includes(searchText) ||
      ngo.toLowerCase().includes(searchText) ||
      formattedDate.toLowerCase().includes(searchText) // ✅ UPDATED
    );
  });

  // ➕ SUMMARY (SAFE)
  const totalDeliveries = historyData.length;
  const totalEarned = historyData.reduce(
    (sum, i) => sum + (i?.earnings || 0),
    0
  );

  const todayStr = new Date().toDateString();

  const thisWeekData = historyData.filter((i) => {
    if (!i?.completedAt) return false;
    return (
      new Date(i.completedAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
  });

  const weekDeliveries = thisWeekData.length;
  const weekEarnings = thisWeekData.reduce(
    (sum, i) => sum + (i?.earnings || 0),
    0
  );

  // ➕ GROUPING (SAFE)
  const grouped = {
    today: [] as any[],
    yesterday: [] as any[],
    older: [] as any[],
  };

  filteredData.forEach((item) => {
    if (!item?.completedAt) return; // ✅ ADDED SAFETY

    const d = new Date(item.completedAt);
    const diff =
      (new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

    if (d.toDateString() === todayStr) grouped.today.push(item);
    else if (diff < 2) grouped.yesterday.push(item);
    else grouped.older.push(item);
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>

        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#2ECC71",
            padding: 20,
            paddingTop: 50,
            minHeight: 140, // ➕ ADDED
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}> {/* ➕ ADDED */}

            <Text style={{ fontSize: 30, fontWeight: "bold", color: "#fff" }}>
              History
            </Text>

            <Ionicons
              name="time"
              size={30}
              color="#E8F5E9"
              style={{ marginLeft: 13 }}
            />

          </View>
          <Text style={{ color: "#E8F5E9", marginTop: 8 }}>
            Track your past deliveries and activity
          </Text>
        </View>

        {/* FILTER BUTTONS (UI ONLY) */}


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
            <Ionicons name="search" size={25} color="#6B7280" />
            <TextInput
              placeholder="Search (e.g. KFC, NGO, 01/05/2026, 09:20)"
              value={search}
              onChangeText={setSearch}
              style={{ marginLeft: 10, flex: 1 }}
            />
          </View>
          {/* ➕ FILTERS MOVED BELOW SEARCH */}
          <View style={{ flexDirection: "row", marginTop: 15 }}> {/* ✅ UPDATED */}
            {["all", "today", "week"].map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  marginRight: 10,
                  padding: 8,
                  backgroundColor: filter === f ? "#2ECC71" : "#ddd",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: filter === f ? "#fff" : "#000" }}>
                  {f === "all" ? "All" : f === "today" ? "Today" : "This Week"}
                </Text>
              </Pressable>
            ))}
          </View>
          {/* ➕ SUMMARY CARDS */}
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10, marginTop: 15 }}>
            <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
              <Ionicons name="bicycle" size={22} color="#2ECC71" />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{totalDeliveries}</Text>
              <Text>Deliveries</Text>
            </View>

            <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
              <Ionicons name="cash" size={22} color="#2ECC71" />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{totalEarned}</Text>
              <Text>Earned</Text>
            </View>

            <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
              <Ionicons name="trending-up" size={22} color="#2ECC71" />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{weekEarnings}</Text>
              <Text>This Week</Text>
            </View>
          </View>
          {/* ➕ FILTER BUTTONS */}


          {filteredData.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No deliveries yet
            </Text>
          )}

          {/* GROUPED LIST */}
          {[
            { title: "Today", data: grouped.today },
            { title: "Yesterday", data: grouped.yesterday },
            { title: "Older", data: grouped.older },
          ].map((section) =>
            section.data.length > 0 ? (
              <View key={section.title}>
                <Text style={{ marginTop: 20, fontWeight: "bold" }}>
                  {section.title}
                </Text>

                {section.data.map((item, index) => (
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
                      {item?.restaurant || "Unknown"} → {item?.ngo || "Unknown"}
                    </Text>

                    <Text style={{ color: "#6B7280", marginTop: 5 }}>
                      {item?.distance} km • ₹{item?.earnings || 0}
                    </Text>

                    <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                      {item?.completedAt
                        ? new Date(item.completedAt).toLocaleString("en-GB")
                        : "-"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null
          )}
        </View>
      </ScrollView>

      {/* MODAL UNCHANGED */}

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