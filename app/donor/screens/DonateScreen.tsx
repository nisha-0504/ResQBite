import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
export default function DonateScreen() {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>             Add Food Donation</Text>
      </View>

      <View style={styles.form}>

        {/* Food Name */}
        <Text style={styles.label}>Food Name</Text>
        <TextInput
          placeholder="e.g., Veg Biryani, Fresh Fruits"
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
        />

        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          placeholder="e.g., 40 packets, 25 kg"
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* Pickup Time */}
        <Text style={styles.label}>Pickup Time</Text>
        <TextInput
          placeholder="--:--"
          style={styles.input}
          value={pickupTime}
          onChangeText={setPickupTime}
        />

        {/* Expiry Time */}
        <Text style={styles.label}>Expiry Time</Text>
        <TextInput
          placeholder="dd-mm-yyyy --:--"
          style={styles.input}
          value={expiryTime}
          onChangeText={setExpiryTime}
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Enter pickup location"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        {/* Upload Box */}
        <View style={styles.uploadBox}>
          <Text style={{ color: '#6B7280' }}>Click to upload image</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
  style={styles.submitBtn}
  onPress={() => router.replace('/donor/(tabs)')}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    Submit Donation
  </Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  header: {
    backgroundColor: '#2ECC71',
    marginTop:25,
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  form: {
    padding: 16,
  },

  label: {
    marginTop: 12,
    marginBottom: 5,
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  uploadBox: {
    marginTop: 15,
    height: 120,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: '#F58634',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});