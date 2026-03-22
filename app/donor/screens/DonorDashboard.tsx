import React from "react";
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DonorDashboard() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hello, Restaurant ABC</Text>
        <Text style={styles.subtitle}>Save Food • Feed People</Text>

        <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('./(tabs)/donate')}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    Donate Food
  </Text>
</TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard value="150" label="Meals Donated" />
        <StatCard value="45kg" label="Food Saved" />
        <StatCard value="120" label="People Helped" />
      </View>

      {/* Active Donations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Active Donations</Text>

        <DonationCard
          title="Veg Meals"
          qty="40 packets"
          time="9:00 PM"
          status="Waiting for NGO"
          statusColor="#FACC15"
        />

        <DonationCard
          title="Fresh Fruits"
          qty="25 kg"
          time="8:30 PM"
          status="Volunteer Assigned"
          statusColor="#22C55E"
        />
      </View>
    </ScrollView>
  );
}

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
function DonationCard({ title, qty, time, status, statusColor }: any) {
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
  onPress={() => router.push('/donation-details')}
>
  <Text style={styles.detailsText}>View Details</Text>
</TouchableOpacity>
    </View>
  );
}

/* 🔥 Styles */
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

  buttonText: {
    color: "white",
    fontWeight: "bold",
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
});
