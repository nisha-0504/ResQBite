import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import API from "../../../services/api"; // adjust path if needed

export default function DonateScreen() {
  const router = useRouter();

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // ✅ SUBMIT HANDLER
  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!foodName || !quantity || !location) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }

      const payload = {
        title: foodName,
        description: foodName,
        foodType: "veg",
        quantity,
        location,
        pickupTime: pickupDate,
        expiryTime: expiryDate
      };

      console.log("Sending:", payload);

      await API.post("/donor/donations", payload);

      Alert.alert("Success", "Donation created successfully!");

      // Reset form (optional)
      setFoodName("");
      setQuantity("");
      setLocation("");
      setPickupDate("");
      setExpiryDate("");

      router.replace("/donor/(tabs)");
    } catch (err) {
      console.log((err as any)?.response?.data || (err as Error)?.message);
      Alert.alert("Error", "Failed to create donation");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donate Food</Text>

      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Pickup Time"
        value={pickupDate}
        onChangeText={setPickupDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Expiry Time"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Donation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});