import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { BASE_URL } from "../config";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [customVehicle, setCustomVehicle] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses are allowed");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept Terms & Conditions");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).+$/;

    if (!passwordRegex.test(password)) {
      setError("Password must contain 1 uppercase letter and 1 number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            dob,
            age,
            gender,
            email,
            password,
            vehicleType,
          }),
        },
      );

      const data = await response.json();
      console.log("SIGNUP RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || data.error || "Signup failed");
        return;
      }

      setSuccess("Signup successful 🎉");
      router.replace("/login");
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
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

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : null}

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#888"
          autoCapitalize="words"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* DOB */}
        <Text style={styles.label}>Date of Birth/ Date of Establishment</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.input}
        >
          <Text>{dob.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput value={age} editable={false} style={styles.input} />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>

        <View style={styles.genderContainer}>
          {["male", "female", "other"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.genderButton,
                gender === item && styles.genderSelected,
              ]}
              onPress={() => setGender(item)}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === item && styles.genderTextSelected,
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#888"
            autoCapitalize="none"
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
            Password must contain 8 characters
          </Text>
        ) : null}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#888"
            autoCapitalize="none"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError("");
            }}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Vehicle Type */}
        <Text style={styles.label}>Vehicle Type (Optional)</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setVehicleType(value)}
            value={vehicleType}
            placeholder={{
              label: "Select Vehicle Type",
              value: null,
            }}
            items={[
              { label: "Bike", value: "Bike" },
              { label: "Scooter", value: "Scooter" },
              { label: "Car", value: "Car" },
              { label: "Truck", value: "Truck" },
              {
                label: "Other (Please specify)",
                value: "Other",
              },
            ]}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
              placeholder: {
                color: "#888",
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
          />
        </View>
        {vehicleType === "Other" && (
          <TextInput
            placeholder="Please specify vehicle"
            placeholderTextColor="#888"
            style={styles.input}
            value={customVehicle}
            onChangeText={setCustomVehicle}
          />
        )}

        {showPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker(false);

              if (selectedDate) {
                setDob(selectedDate);

                const today = new Date();

                let calculatedAge =
                  today.getFullYear() - selectedDate.getFullYear();

                const monthDifference =
                  today.getMonth() - selectedDate.getMonth();

                if (
                  monthDifference < 0 ||
                  (monthDifference === 0 &&
                    today.getDate() < selectedDate.getDate())
                ) {
                  calculatedAge--;
                }

                setAge(calculatedAge.toString());
              }
            }}
          />
        )}

        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
            <Ionicons
              name={acceptedTerms ? "checkbox" : "square-outline"}
              size={24}
              color="#F58634"
            />
          </TouchableOpacity>

          <Text style={styles.termsText}>I agree to Terms & Conditions</Text>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.signupBtn, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupText}>
            {loading ? "Creating account..." : "Signup"}
          </Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <Text style={styles.login} onPress={() => router.push("/login")}>
          Already have an account? Login
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 10,
    fontWeight: "500",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 12,
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

  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  genderSelected: {
    backgroundColor: "#F58634",
    borderColor: "#F58634",
    elevation: 3,
  },

  genderText: {
    color: "black",
    fontWeight: "500",
  },

  genderTextSelected: {
    color: "white",
    fontWeight: "bold",
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  termsText: {
    marginLeft: 10,
    color: "#444",
    fontSize: 14,
  },
  inlineError: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  pickerInput: {
    paddingVertical: 14,
    fontSize: 16,
    color: "black",
  },
});
