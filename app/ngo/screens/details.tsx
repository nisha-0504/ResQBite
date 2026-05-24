import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import API from "../../../services/api";
import AsyncStorage
from
"@react-native-async-storage/async-storage";

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = params.id as string;
  const foodType =params.foodType as string;
  const meals = params.quantity as string;
  const location = params.location as string;
  const image = params.image as string;

  const [quantity, setQuantity] = useState(10);
  const [claimed, setClaimed] = useState(false);

  const handleConfirm = async () => {
  try {
    const token =
  await AsyncStorage.getItem(
    "token"
  );
    await API.put(
  `/ngo/accept/${id}`,
  {},
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

    setClaimed(true);

    Alert.alert(
      "Success ✅",
      `Food donation accepted`
    );

    router.replace("/ngo/(tabs)");

  } catch (err) {

    const error = err as any;

console.log(
  error.response?.data || error.message
);

    Alert.alert(
      "Error",
      "Failed to accept donation"
    );
  }
};

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{
          uri:
            image ||
            "https://via.placeholder.com/300", 
        }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{foodType}</Text>

        <Text style={styles.info}>🍱 Available: {meals}</Text>
        <Text style={styles.info}>📍 {location}</Text>

        {/* Quantity Selector */}
        <Text style={styles.label}>Select Quantity</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 5))}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 5)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.button, claimed && { backgroundColor: "gray" }]}
          onPress={handleConfirm}
          disabled={claimed}
        >
          <Text style={styles.buttonText}>
            {claimed ? "Claimed ✅" : "Confirm Claim"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 200,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2fb463",
  },

  info: {
    marginTop: 10,
    fontSize: 15,
  },

  label: {
    marginTop: 20,
    fontWeight: "bold",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: "#ff7a3c",
    padding: 10,
    borderRadius: 8,
  },

  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  qtyValue: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#2fb463",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});