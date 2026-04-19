import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DonateScreen() {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const router = useRouter();
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [pickupDate, setPickupDate] = useState(new Date());
  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);

  const onPickupDateChange = (event, selectedDate) => {
    setShowPickupDate(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
      setTimeout(() => setShowPickupTime(true), 100);
    }
  };

  const onPickupTimeChange = (event, selectedTime) => {
    setShowPickupTime(false);
    if (selectedTime) {
      const updated = new Date(pickupDate);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setPickupDate(updated);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDate(false);

    if (selectedDate) {
      setExpiryDate(selectedDate);
      setTimeout(() => setShowTime(true), 100); // smoother
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      const updated = new Date(expiryDate);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setExpiryDate(updated);
    }
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, 4));
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, 4));
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}> Add Food Donation</Text>
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
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPickupDate(true)}
        >
          <Text>{pickupDate.toLocaleString()}</Text>
        </TouchableOpacity>

        {showPickupDate && (
          <DateTimePicker
            value={pickupDate}
            mode="date"
            onChange={onPickupDateChange}
          />
        )}

        {showPickupTime && (
          <DateTimePicker
            value={pickupDate}
            mode="time"
            onChange={onPickupTimeChange}
          />
        )}

        {/* Expiry Time */}
        <Text style={styles.label}>Expiry Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {expiryDate
              ? expiryDate.toLocaleString()
              : "Select Expiry Date & Time"}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {showTime && (
          <DateTimePicker
            value={expiryDate}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

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
          {/* SHOW IMAGES */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: img }} style={styles.imageThumb} />

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* ADD BUTTON */}
            {images.length < 4 && (
              <TouchableOpacity style={styles.addBox} onPress={pickImage}>
                <Text style={{ fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* CAMERA + GALLERY */}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openCamera}>
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => router.replace("/donor/(tabs)")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
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
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#2ECC71",
    marginTop: 25,
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  form: {
    padding: 16,
  },

  label: {
    marginTop: 12,
    marginBottom: 5,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  uploadBox: {
    marginTop: 15,
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CA3AF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: "#F58634",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontWeight: "bold",
  },

  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },

  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    margin: 5,
  },

  addBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },

  optionText: {
    marginRight: 15,
    color: "#16A34A",
    fontWeight: "bold",
  },

  imageContainer: {
    position: "relative",
  },

  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
