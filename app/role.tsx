import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Role() {
  const router = useRouter();

  const handleRoleSelect = async (selectedRole:string) => {
    console.log("Selected role:", selectedRole);

    try {
      await AsyncStorage.setItem("selectedRole", selectedRole);

      if (selectedRole === "donor") {
        router.replace("/donor/(tabs)");
      } else if (selectedRole === "ngo") {
        router.replace("/ngo/(tabs)");
      } else {
        router.replace("/volunteer/(tabs)/home");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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
          <Text style={styles.cardDesc}>
            Restaurants, Hotels, Households
          </Text>
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
          <Text style={styles.cardDesc}>
            Food distribution organizations
          </Text>
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
          <Text style={styles.cardDesc}>
            Pickup and deliver food
          </Text>
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
