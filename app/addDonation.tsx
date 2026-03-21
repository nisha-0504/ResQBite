import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddDonation() {
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    console.log(food, quantity, location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Donation</Text>

      <TextInput
        placeholder="Food Name"
        style={styles.input}
        value={food}
        onChangeText={setFood}
      />

      <TextInput
        placeholder="Quantity"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
