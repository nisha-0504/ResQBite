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
<<<<<<< HEAD
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "../../../services/api";
=======
import API from "../../../services/api"; // adjust path if needed

>>>>>>> origin/nishh
export default function DonateScreen() {
  const router = useRouter();

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
<<<<<<< HEAD
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [pickupDate, setPickupDate] = useState(new Date());
  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const onPickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupDate(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
      setTimeout(() => setShowPickupTime(true), 100);
    }
  };

  const onPickupTimeChange = (event: any, selectedTime?: Date) => {
    setShowPickupTime(false);
    if (selectedTime) {
      const updated = new Date(pickupDate);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setPickupDate(updated);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDate(false);

    if (selectedDate) {
      setExpiryDate(selectedDate);
      setTimeout(() => setShowTime(true), 100); // smoother
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
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

  const removeImage = (indexToRemove:number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  const handleSubmit = async () => {
  try {
    if (!foodName || !quantity || !location) {
      alert("Please fill all required fields");
      return;
    }

    let uploadedImages = [];

    // 🔥 Upload all images to Cloudinary
    for (let uri of images) {
      const data = new FormData();

      data.append("file", {
        uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);

      data.append("upload_preset", "resqbite_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhvjgmkif/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const file = await res.json();
      uploadedImages.push(file.secure_url);
    }

    // 🔥 Send to backend
    await API.post("/donor/donations", {
      title: foodName,
      quantity,
      location,
      pickupTime: pickupDate,
      expiryTime: expiryDate,
      images: uploadedImages,
    });

    alert("Donation created successfully!");

    router.replace("/donor/(tabs)");
  } catch (err: any) {
    console.log(err.response?.data || err.message);
    alert("Error creating donation");
  }
};
=======
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

>>>>>>> origin/nishh
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

<<<<<<< HEAD
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
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Submit Donation
          </Text>
        </TouchableOpacity>
      </View>
=======
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Donation</Text>
      </TouchableOpacity>
>>>>>>> origin/nishh
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
<<<<<<< HEAD

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
=======
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
>>>>>>> origin/nishh
});