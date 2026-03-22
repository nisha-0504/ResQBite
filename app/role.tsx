import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Role() {
  const router = useRouter();
  const { name, email, password } = useLocalSearchParams();
  const handleRoleSelect = async (selectedRole: string) => {
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
            role: selectedRole,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful 🎉");
        router.replace("/login");
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
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>How would you like to contribute?</Text>

      {/* Donor */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRoleSelect("donor")}
      >
        <View style={styles.iconBoxOrange}>
          <Text>🍴</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Donor</Text>
          <Text style={styles.cardDesc}>Restaurants, Hotels, Households</Text>
        </View>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* NGO */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRoleSelect("ngo")}
      >
        <View style={styles.iconBoxGreen}>
          <Text>💚</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>NGO</Text>
          <Text style={styles.cardDesc}>Food distribution organizations</Text>
        </View>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* Volunteer */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRoleSelect("volunteer")}
      >
        <View style={styles.iconBoxBlue}>
          <Text>🚚</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Volunteer</Text>
          <Text style={styles.cardDesc}>Pickup and deliver food</Text>
        </View>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        You can change your role anytime from settings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAF7EF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  iconBoxOrange: {
    backgroundColor: "#FFE5D0",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  iconBoxGreen: {
    backgroundColor: "#DFF5E1",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  iconBoxBlue: {
    backgroundColor: "#DCEBFF",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDesc: {
    color: "gray",
  },
  arrow: {
    fontSize: 18,
    color: "gray",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "gray",
  },
});
