import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const foodData = [
  {
    id: "1",
    name: "Restaurant ABC",
    meals: "30 meals",
    distance: "2 km",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  },
  {
    id: "2",
    name: "Hotel Green Leaf",
    meals: "50 meals",
    distance: "3.5 km",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, Helping Hands</Text>
          <Text style={styles.subText}>Making a difference every day</Text>
        </View>

        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
        </View>
      </View>

      {/* Active Pickup Card */}
      <View style={styles.activeCard}>
        <Text style={styles.activeTitle}>Active Pickup</Text>
        <Text style={styles.activeText}>Pickup from Restaurant ABC</Text>

        <View style={styles.row}>
          <Ionicons name="bicycle-outline" size={16} color="#fff" />
          <Text style={styles.activeText}> Volunteer: Raj</Text>
        </View>

        <Text style={styles.activeText}>Status: On the Way</Text>
        <View style={styles.mapPlaceholder}>
          <TouchableOpacity onPress={() => router.push("/ngo/tracking")}>
            <Text style={styles.trackText}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Food Available Nearby</Text>

      {/* Food Cards */}
      {foodData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.name}</Text>

            <View style={styles.infoRow}>
              <View style={styles.row}>
                <Ionicons name="people-outline" size={16} />
                <Text style={styles.infoText}> {item.meals}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="location-outline" size={16} />
                <Text style={styles.infoText}> {item.distance}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Claim Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  subText: {
    color: "#e6ffe6",
    marginTop: 5,
  },

  bell: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 20,
  },

  activeCard: {
    backgroundColor: "#ff7a3c",
    margin: 20,
    padding: 15,
    borderRadius: 15,
  },

  activeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  activeText: {
    color: "#fff",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  mapPlaceholder: {
    width: 80,
    height: 40,
    backgroundColor: "#2fb463",
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  trackText: {
    color: "white", // White font color
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
  },

  cardContent: {
    padding: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  infoText: {
    color: "#555",
  },

  button: {
    backgroundColor: "#ff7a3c",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
