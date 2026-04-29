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
import API from "../../../services/api"; // adjust path
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

  // ✅ Fetch donation details
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

  // ✅ Delete donation
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
      <Text style={styles.title}>{donation.title}</Text>

      <Text style={styles.label}>Quantity:</Text>
      <Text style={styles.value}>{donation.quantity}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{donation.location}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{donation.status}</Text>

      <Text style={styles.label}>Created At:</Text>
      <Text style={styles.value}>
        {new Date(donation.createdAt).toLocaleString()}
      </Text>

      {/* ✅ Delete Button only if pending */}
      {donation.status === "pending" && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Donation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  label: {
    fontWeight: "bold",
    marginTop: 10
  },
  value: {
    marginBottom: 5
  },
  deleteBtn: {
    marginTop: 30,
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});