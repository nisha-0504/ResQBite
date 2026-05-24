import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useEffect, useState } from "react";

import API from "../../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function HistoryScreen() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/ngo/history");

      setHistoryData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pickup History</Text>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {historyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📜</Text>

            <Text style={styles.emptyTitle}>No History Yet</Text>

            <Text style={styles.emptyText}>
              Completed pickups will appear here
            </Text>
          </View>
        ) : (
          historyData.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Icon */}
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={18} color="#2fb463" />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.foodType}</Text>

                <View style={styles.row}>
                  <Ionicons name="cube-outline" size={14} color="#777" />
                  <Text style={styles.subText}> {item.quantity} meals</Text>
                </View>

                <Text style={styles.subText}>Completed Successfully</Text>

                <Text style={styles.date}>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    elevation: 3,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f7ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  title: {
    fontWeight: "bold",
    fontSize: 15,
  },

  subText: {
    color: "#666",
    marginTop: 3,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2fb463",
    marginTop: 10,
  },

  emptyText: {
    marginTop: 5,
    color: "#777",
    textAlign: "center",
  },
});
