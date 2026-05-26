import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import API from "../services/api";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail accounts are allowed");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      console.log("TOKEN SAVED:", data.token);
      router.replace("/role");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  
  const handleGoogleLogin = async (token: string) => {
    try {
      
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();

      const backendRes = await API.post("/auth/google", {
        name: user.name,
        email: user.email,
        googleId: user.id,
      });

      const data = backendRes.data;

      console.log("Backend response:", data);
    } catch (err: any) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1542810634-71277d95dcbb",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue saving food</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {password.length > 0 && password.length < 8 ? (
        <Text style={styles.inlineError}>
          Password must contain at least 8 characters
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Please wait..." : "Login"}
        </Text>
      </TouchableOpacity>

      

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signup}>Signup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 60,
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
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  errorText: {
    color: "#B91C1C",
    fontWeight: "500",
  },
  successBox: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  successText: {
    color: "#166534",
  },
  inlineError: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
});
