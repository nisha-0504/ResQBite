import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import API from "../../../services/api";

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [claimedItems, setClaimedItems] = useState<string[]>([]);
  const [foodData, setFoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ngoName, setNgoName] = useState("");
  const [activeDonation, setActiveDonation] = useState<any>(null);

  useEffect(() => {
    fetchDonations();
    fetchActiveDonation();
    fetchProfile();
    if (params.claimedId) {
      setClaimedItems((prev) => [...prev, params.claimedId as string]);
    }
  }, [params.claimedId]);

  const fetchDonations = async () => {
    try {
      const res = await API.get("/ngo/donations");
      setFoodData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDonation = async () => {
    try {
      const res = await API.get("/ngo/active");

      if (res.data.length > 0) {
        setActiveDonation(res.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setNgoName(res.data.name);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, {ngoName}</Text>
          <Text style={styles.subText}>Making a difference every day</Text>
        </View>

        <TouchableOpacity
          style={styles.bell}
          onPress={() => router.push("/ngo/screens/NotificationsScreen")}
        >
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Active Pickup Card */}
      {activeDonation && (
        <View style={styles.activeCard}>
          <Image
            source={{
              uri:
                activeDonation.images?.[0] || "https://via.placeholder.com/300",
            }}
            style={styles.activeImage}
          />

          <Text style={styles.activeTitle}>Active Pickup</Text>

          <Text style={styles.activeText}>{activeDonation.foodType}</Text>

          <Text style={styles.activeText}>📍 {activeDonation.location}</Text>

          <Text style={styles.activeText}>
            🍱 {activeDonation.quantity} meals
          </Text>

          <Text style={styles.activeText}>Status: Accepted</Text>

          <TouchableOpacity
            style={styles.mapPlaceholder}
            onPress={() =>
              router.push({
                pathname: "/ngo/tracking",
                params: { id: activeDonation._id },
              })
            }
          >
            <Text style={styles.trackText}>Track</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Food Available Nearby</Text>

      {/* Food Cards */}
      {foodData.map((item) => {
        const isClaimed = claimedItems.includes(item._id);

        return (
          <View key={item._id} style={styles.card}>
            <Image
              source={{
                uri: item.images?.[0] || "https://via.placeholder.com/300",
              }}
              style={styles.image}
            />

            <View style={styles.cardContent}>
              <Text style={styles.title}>
                {item.foodType || "Food Donation"}
              </Text>

              <View style={styles.infoRow}>
                <View style={styles.row}>
                  <Ionicons name="people-outline" size={16} />
                  <Text style={styles.infoText}> {item.quantity} meals</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={16} />
                  <Text style={styles.infoText}> {item.location}</Text>
                </View>
              </View>

              {/* 👇 UPDATED BUTTON */}
              <TouchableOpacity
                style={[
                  styles.button,
                  isClaimed && { backgroundColor: "gray" },
                ]}
                disabled={isClaimed}
                onPress={() =>
                  router.push({
                    pathname: "/ngo/screens/details", 
                    params: {
                      id: item._id,
                      foodType: item.foodType,
                      quantity: item.quantity,
                      location: item.location,
                      image: item.images?.[0],
                    },
                  })
                }
              >
                <Text style={styles.buttonText}>
                  {isClaimed ? "Claimed ✅" : "Claim Food"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
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
    paddingHorizontal: 20,
    paddingBottom: 25,
    minHeight: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    margin: 10,
    padding: 16,
    borderRadius: 20,
    elevation: 3,
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 20,
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
  activeImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
});
