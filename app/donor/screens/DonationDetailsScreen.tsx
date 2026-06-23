import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "../../../services/api"; 
type Donation = {
  _id: string;
  title: string;
  quantity: string;
  location: string;
  status: string;
  createdAt: string;
};
export default function DonationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDonation = async () => {
    try {
      const res = await API.get(`/donor/donations/${id}`);
      setDonation(res.data);
    } catch (err) {
      console.log((err as any).response?.data || (err as any).message);
      Alert.alert("Error", "Failed to load donation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, []);

  const handleDelete = async () => {
    Alert.alert(
      "Delete Donation",
      "Are you sure you want to delete this donation?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/donor/donations/${id}`);
              Alert.alert("Deleted successfully");
              router.back();
            } catch (err) {
              console.log((err as any).response?.data || (err as any).message);
              Alert.alert("Cannot delete this donation");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!donation) {
    return (
      <View style={styles.container}>
        <Text>Donation not found</Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>

    
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Donation Details</Text>
      <Text style={styles.headerSubtitle}>
        Track your food donation
      </Text>
    </View>

    
    <View style={styles.card}>
      <Text style={styles.title}>{donation.title}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Quantity</Text>
        <Text style={styles.value}>{donation.quantity}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{donation.location}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                donation.status === "pending"
                  ? "#FEF3C7"
                  : "#DCFCE7",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  donation.status === "pending"
                    ? "#D97706"
                    : "#16A34A",
              },
            ]}
          >
            {donation.status}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Created</Text>
        <Text style={styles.value}>
          {new Date(donation.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>

   
    {donation.status === "pending" && (
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={handleDelete}
      >
        <Text style={styles.deleteText}>
          Delete Donation
        </Text>
      </TouchableOpacity>
    )}

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
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  headerSubtitle: {
    color: "white",
    marginTop: 5,
    opacity: 0.9,
  },

  card: {
    backgroundColor: "white",
    margin: 18,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  label: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },

  value: {
    fontWeight: "bold",
    color: "#111827",
    maxWidth: "55%",
    textAlign: "right",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  deleteBtn: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: "#F58634",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});