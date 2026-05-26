import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import API from "../../../services/api";
type User = {
  name: string;
  email: string;
  role: string;
};

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "response" in err) {
    return (err as any).response?.data || (err as any).message || String(err);
  }
  return String(err);
};

export default function DonorDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
  try {
    const res = await API.get("/auth/profile");

    console.log("PROFILE DATA:", res.data);

    setUser(res.data);
  } catch (err: unknown) {
    console.log("❌ USER FETCH DETAILS:", getErrorMessage(err));
  }
};
    fetchUser();
  }, []);
  
  const fetchDonations = async () => {
    try {
      const res = await API.get("/donor/donations");
      setDonations(res.data);
    } catch (err: unknown) {
      console.log(getErrorMessage(err));
    }
  };
  const onRefresh = async () => {
  setRefreshing(true);
  await fetchDonations();
  setRefreshing(false);
};
  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={["#2ECC71"]}
    />
  }
  >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {user?.name || "User"}</Text>
        <Text style={styles.subtitle}>Save Food • Feed People</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("./(tabs)/donate")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Donate Food
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats (still static for now) */}
      <View style={styles.statsContainer}>
        <StatCard value="0" label="Meals Donated" />
        <StatCard value="0 kg" label="Food Saved" />
        <StatCard value="0" label="People Helped" />
      </View>

      {/* Active Donations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Active Donations</Text>
        {donations.length === 0 ? (
          <View style={styles.emptyContainer}>
  <Text style={{ fontSize: 50 }}>🍱</Text>

  <Text style={styles.emptyTitle}>
    No Donations Yet
  </Text>

  <Text style={styles.emptyText}>
    Start donating food to help people.
  </Text>
</View>
        ) : (
          donations.map((item) => (
            <DonationCard
              key={item._id}
              id={item._id}
              title={item.foodType || "Food Item"}
              qty={item.quantity}
              time={
                item.pickupTime
                  ? new Date(item.pickupTime).toLocaleTimeString()
                  : new Date(item.createdAt).toLocaleTimeString()
              }
              status={item.status || "pending"}
              statusColor={getStatusColor(item.status)}
            />
          ))
        )}{" "}
      </View>
    </ScrollView>
  );
}

/* 🔹 Status Color Helper */
const getStatusColor = (status: any) => {
  switch (status) {
    case "pending":
      return "#FACC15";
    case "accepted":
      return "#22C55E";
    case "picked":
      return "#3B82F6";
    case "completed":
      return "#10B981";
    case "rejected":
      return "#EF4444";
    default:
      return "#ccc";
  }
};

/* 🔹 Stat Card */
function StatCard({ value, label }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

/* 🔹 Donation Card */
function DonationCard({ id, title, qty, time, status, statusColor }: any) {
  const router = useRouter();

  return (
    <View style={styles.donationCard}>
      <View style={styles.row}>
        <Text style={styles.foodTitle}>{title}</Text>

        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.qty}>{qty}</Text>
      <Text style={styles.time}>Pickup at {time}</Text>

      <TouchableOpacity
        style={styles.detailsBtn}
        onPress={() =>
          router.push({
            pathname: "/donation-details",
            params: { id: id },
          })
        }
      >
        <Text style={styles.detailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#2ECC71",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 20,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "white",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#F58634",
    marginTop: 25,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: 100,
  },

  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cardLabel: {
    fontSize: 12,
    color: "gray",
  },

  section: {
    marginTop: 30,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  donationCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  foodTitle: {
    fontWeight: "bold",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    color: "black",
  },

  qty: {
    marginTop: 5,
    color: "gray",
  },

  time: {
    marginTop: 3,
    color: "gray",
  },

  detailsBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2ECC71",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },

  detailsText: {
    color: "#2ECC71",
    fontWeight: "500",
  },
  emptyContainer: {
  alignItems: "center",
  marginTop: 30,
},

emptyTitle: {
  fontWeight: "bold",
  fontSize: 18,
  marginTop: 10,
},

emptyText: {
  color: "#6B7280",
  marginTop: 5,
},
});
