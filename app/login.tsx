import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  console.log("LOGIN CLICKED");

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      alert("Backend failed — continuing for testing 🚀");
    }

    router.replace("/role");

  } catch (error) {
    console.error(error);

    alert("Server error — continuing 🚀");
    router.replace("/role");
  }
};

  return (
    <View style={styles.container}>
      
      {/* Image */}
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1542810634-71277d95dcbb" }}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue saving food</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Signup */}
      <Text style={styles.signup} onPress={() => router.push("/signup")}>
        Create New Account
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    marginLeft: 10,
    flex: 1,
    borderWidth: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: "#F58634",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  googleBtn: {
    borderWidth: 1,
    borderColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  googleText: {
    color: "#22C55E",
    fontWeight: "500",
  },
  signup: {
    marginTop: 15,
    textAlign: "center",
    color: "#22C55E",
  },
});