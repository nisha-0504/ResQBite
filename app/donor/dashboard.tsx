import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function DonorDashboard() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const data = new FormData();

    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);

    data.append("upload_preset", "resqbite_upload");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhvjgmkif/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const file = await res.json();
      console.log("Uploaded URL:", file.secure_url);
    } catch (error) {
      console.log("Upload error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Dashboard</Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Upload Food Image 📸</Text>
      </TouchableOpacity>

      {/* Show Image */}
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* Track Delivery */}
      <TouchableOpacity
        style={styles.trackBtn}
        onPress={() => router.push("/ngo/screens/TrackingScreen.tsx")}
      >
        <Text style={styles.btnText}>Track Delivery 📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAF7EF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  btn: {
    backgroundColor: "#F58634",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  trackBtn: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});