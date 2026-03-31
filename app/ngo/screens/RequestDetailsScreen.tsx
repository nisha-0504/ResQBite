import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RequestDetailsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Food Request</Text>
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        <Text style={styles.restaurant}>Restaurant ABC</Text>
        <Text style={styles.meals}>30 Veg Meals</Text>

        {/* Time */}
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Feather name="clock" size={16} color="#2fb463" />
          </View>
          <View>
            <Text style={styles.label}>Available Until</Text>
            <Text style={styles.value}>9:00 PM Today</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={16} color="#2fb463" />
          </View>
          <View>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              123 Main Street, 2 km away
            </Text>
          </View>
        </View>
      </View>

      {/* Food Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Food Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.left}>Type</Text>
          <Text style={styles.right}>Vegetarian</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.left}>Quantity</Text>
          <Text style={styles.right}>30 packets</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.left}>Prepared At</Text>
          <Text style={styles.right}>6:00 PM</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.left}>Best Before</Text>
          <Text style={styles.right}>9:00 PM</Text>
        </View>
      </View>

      {/* Impact */}
      <View style={styles.impactCard}>
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#ff7a3c" />
          <Text style={styles.impactTitle}> Impact</Text>
        </View>

        <Text style={styles.impactText}>
          This donation can feed approximately{" "}
          <Text style={styles.highlight}>30 people</Text> and save{" "}
          <Text style={styles.highlight}>5 kg</Text> of food from waste.
        </Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Claim This Food</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryText}>View on Map</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  header: {
    backgroundColor: "#2fb463",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },

  mainCard: {
    backgroundColor: "#dce9e2",
    margin: 20,
    borderRadius: 15,
    padding: 15,
  },

  restaurant: {
    fontSize: 18,
    fontWeight: "bold",
  },

  meals: {
    marginTop: 5,
    color: "#555",
  },

  infoRow: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },

  iconCircle: {
    backgroundColor: "#e6f7ee",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  label: {
    color: "#777",
    fontSize: 12,
  },

  value: {
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  left: {
    color: "#777",
  },

  right: {
    fontWeight: "600",
  },

  impactCard: {
    backgroundColor: "#f8e1d6",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  impactTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  impactText: {
    marginTop: 10,
    color: "#444",
  },

  highlight: {
    color: "#ff7a3c",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  primaryBtn: {
    backgroundColor: "#ff7a3c",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },

  secondaryBtn: {
    borderColor: "#2fb463",
    borderWidth: 1.5,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },

  secondaryText: {
    color: "#2fb463",
    fontWeight: "bold",
  },
});