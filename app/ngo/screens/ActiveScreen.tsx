import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ActiveScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Active Pickups</Text>
          <Text style={styles.subText}>Track and manage your pickups</Text>
        </View>

        <TouchableOpacity
  style={styles.bell}
  onPress={() => router.push("/ngo/(tabs)/notifications")}
>
  <Ionicons name="notifications-outline" size={20} color="#fff" />
</TouchableOpacity>
      </View>

      {/* ACTIVE PICKUP CARD */}
      <View style={styles.activeCard}>
        <Text style={styles.activeTitle}>Domino's Pizza</Text>
        <Text style={styles.activeText}>📍 MG Road, Bangalore</Text>

        <View style={styles.row}>
          <Ionicons name="bicycle-outline" size={16} color="#fff" />
          <Text style={styles.activeText}> Volunteer: Nisha</Text>
        </View>

        <Text style={styles.activeText}>🍱 10 meals (Veg)</Text>
        <Text style={styles.status}>Status: On the Way</Text>

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call-outline" size={16} color="#fff" />
            <Text style={styles.btnText}> Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickBtn}>
            <Text style={styles.btnText}>Mark Picked</Text>
          </TouchableOpacity>
        </View>

        {/* TRACK BUTTON */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => router.push("/ngo/tracking")}
        >
          <Ionicons name="location-outline" size={16} color="#fff" />
          <Text style={styles.btnText}> Track on Map</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 60, // better spacing
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
    marginTop: 10, // 👈 FIXED (no overlap issue)
    padding: 18,
    borderRadius: 18,
    elevation: 4,
  },

  activeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  activeText: {
    color: "#fff",
    marginTop: 6,
  },

  status: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: "#2fb463",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  pickBtn: {
    backgroundColor: "#ff9a5c",
    padding: 10,
    borderRadius: 10,
  },

  trackBtn: {
    flexDirection: "row",
    backgroundColor: "#2fb463",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
