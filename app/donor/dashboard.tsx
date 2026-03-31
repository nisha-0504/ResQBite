import { View, Text, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function DonorDashboard() {
  const [image, setImage] = useState<string | null>(null);

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

      <Button title="Upload Image" onPress={pickImage} />

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});