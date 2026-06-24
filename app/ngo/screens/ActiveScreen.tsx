import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import API from "../../../services/api";
import { useState, useEffect } from "react";

export default function ActiveScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<any[]>([]);
  const fetchActiveDonations = async () => {
    try {
      const res = await API.get("/ngo/active");

      setDonations(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchActiveDonations();
  }, []);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Active Pickups</Text>
          <Text style={styles.subText}>Track and manage your pickups</Text>
        </View>
      </View>

      {/* ACTIVE PICKUP CARD */}
      {donations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>

          <Text style={styles.emptyTitle}>No Active Pickups</Text>

          <Text style={styles.emptyText}>
            Accepted donations will appear here
          </Text>
        </View>
      ) : (
        donations.map((item) => (
          <View key={item._id} style={styles.activeCard}>
            <Image
              source={{
                uri: item.images?.[0] || "https://via.placeholder.com/300",
              }}
              style={styles.foodImage}
            />

            <Text style={styles.activeTitle}>{item.foodType}</Text>

            <Text style={styles.activeText}>📍 {item.location}</Text>

            <Text style={styles.activeText}>🍱 {item.quantity} meals</Text>

            <Text style={styles.status}>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() =>
                router.push({
                  pathname: "/ngo/tracking",
                  params: { id: item._id },
                })
              }
            >
              <Ionicons name="location-outline" size={16} color="#fff" />

              <Text style={styles.btnText}>Track Pickup</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
    paddingHorizontal: 20,
    paddingBottom: 25,
    minHeight: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  subText: {
    color: "#e6ffe6",
    marginTop: 5,
  },

  bell: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 20,
  },

  activeCard: {
    backgroundColor: "#ff7a3c",
    margin: 10,
    marginTop: 10, 
    padding: 16,
    borderRadius: 20,
    elevation: 3,
  },

  activeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  activeText: {
    color: "#fff",
    marginTop: 6,
  },

  status: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: "#2fb463",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  pickBtn: {
    backgroundColor: "#ff9a5c",
    padding: 10,
    borderRadius: 10,
  },

  trackBtn: {
    flexDirection: "row",
    backgroundColor: "#2fb463",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  foodImage: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    color: "#2fb463",
  },

  emptyText: {
    marginTop: 6,
    color: "#777",
    textAlign: "center",
  },
});
