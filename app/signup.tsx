import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch(
        "http://192.168.29.159:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "donor",
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful 🎉");
        router.push("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1542810634-71277d95dcbb",
        }}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join ResQBite</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Signup Button */}

      <TouchableOpacity
        style={styles.signupBtn}
        onPress={() => {
          if (password !== confirmPassword) {
            alert("Incorrect Password Entered❌");
            return;
          }
          if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
          }

          router.push({
            pathname: "/role",
            params: { name, email, password },
          });
        }}
      >
        <Text style={styles.signupText}>Signup</Text>
      </TouchableOpacity>

      {/* Login Redirect */}
      <Text style={styles.login} onPress={() => router.push("/login")}>
        Already have an account? Login
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
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
  },
  signupBtn: {
    backgroundColor: "#F58634",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "white",
    fontWeight: "bold",
  },
  login: {
    marginTop: 15,
    textAlign: "center",
    color: "#22C55E",
  },
});
