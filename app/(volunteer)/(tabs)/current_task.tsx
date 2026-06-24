import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../config";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

export default function CurrentTask() {
  const [status, setStatus] = useState("accepted");
  const [task, setTask] = useState<any>(null);
  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getVolunteerLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            return loc.coords;
          }
        } catch (err) {
          console.log("Error getting volunteer GPS location:", err);
        }
        return null;
      };

      const loadTask = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          const token = await AsyncStorage.getItem("token");
          if (!storedUser) {
            console.log("No user found");
            return;
          }

          const user = JSON.parse(storedUser);
          const res = await fetch(`${BASE_URL}/api/volunteer/current`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!data) {
            setTask(null);
            return;
          }

          setTask(data);

          if (data?.status === "picked") {
            setStatus("picked_up");
          } else if (data?.status === "assigned") {
            setStatus("accepted");
          }

          // Warm up GPS location
          getVolunteerLocation();
        } catch (err) {
          console.log(err);
        }
      };

      loadTask();
    }, []),
  );

  const getVolunteerLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        return loc.coords;
      }
    } catch (err) {
      console.log("Error getting volunteer GPS location:", err);
    }
    return null;
  };

  const cancelTask = async () => {
    if (!task) return;

    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`${BASE_URL}/api/volunteer/cancel/${task._id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTask(null);
      setShowCancelModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAction = async () => {
    const token = await AsyncStorage.getItem("token");
    if (status === "accepted") {
      try {
        const coords = await getVolunteerLocation();
        await fetch(`${BASE_URL}/api/volunteer/pickup/${task._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            volunteerLatitude: coords?.latitude,
            volunteerLongitude: coords?.longitude,
          }),
        });

        setStatus("picked_up");
      } catch (err) {
        console.log(err);
      }
    } else if (status === "picked_up") {
      try {
        const coords = await getVolunteerLocation();
        await fetch(`${BASE_URL}/api/volunteer/complete/${task._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            volunteerLatitude: coords?.latitude,
            volunteerLongitude: coords?.longitude,
          }),
        });

        setShowDeliveredPopup(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const openMaps = () => {
    if (!task) return;

    const destination = status === "accepted" ? task.restaurant : task.ngo;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination,
    )}`;

    Linking.openURL(url);
  };

  const getButtonText = () => {
    if (status === "accepted") return "Mark Picked Up";
    if (status === "picked_up") return "Mark Delivered";
    return "";
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚴</Text>

          <Text style={styles.emptyTitle}>No Current Delivery</Text>

          <Text style={styles.emptyText}>
            Accepted deliveries will appear here
          </Text>
        </View>
      </View>
    );
  }
  const handleCall = async (type: "restaurant" | "ngo") => {
    const phone = type === "restaurant" ? "tel:9876543210" : "tel:9123456780";

    const supported = await Linking.canOpenURL(phone);

    if (supported) {
      await Linking.openURL(phone);
    } else {
      console.log("Dialer not supported");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Current Delivery</Text>
        </View>



        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <TouchableOpacity style={styles.button} onPress={openMaps}>
            <Text style={styles.buttonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route</Text>

          <View style={styles.routeRow}>
            <View style={styles.routeLine}>
              <View style={styles.dotGreen} />
              <View style={styles.line} />
              <View style={styles.dotRed} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pickup</Text>
              <Text style={styles.place}>{task?.restaurant || "N/A"}</Text>

              <Text style={[styles.label, { marginTop: 16 }]}>Drop</Text>
              <Text style={styles.place}>{task?.ngo || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => handleCall("restaurant")}
          >
            <Text style={{ marginRight: 10 }}>📞</Text>
            <Text>Call Restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
            onPress={() => handleCall("ngo")}
          >
            <Text style={{ marginRight: 10 }}>📞</Text>
            <Text>Call NGO</Text>
          </TouchableOpacity>
        </View>

        

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          <View style={styles.stepRow}>
            <View style={[styles.circle, styles.done]} />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Accepted</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.stepRow}>
            <View
              style={[styles.circle, status === "picked_up" && styles.done]}
            />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Picked Up</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.stepRow}>
            <View style={styles.circle} />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Delivered</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleAction}
          disabled={!task}
        >
          {getButtonText() ? (
            <Text style={styles.primaryText}>{getButtonText()}</Text>
          ) : null}
        </TouchableOpacity>

        {status === "accepted" && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={styles.secondaryText}>Cancel Task</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showDeliveredPopup} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
            >
              Delivery Completed!
            </Text>

            <Text style={{ marginBottom: 20, fontSize: 16 }}>
              You earned <Text>₹{task?.earnings || 0}</Text>
            </Text>

            <TouchableOpacity
              style={[styles.button, { width: "50%", paddingVertical: 14 }]}
              onPress={() => {
                setShowDeliveredPopup(false);
                setTask(null);
              }}
            >
              <Text style={[styles.buttonText, { fontSize: 18 }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
            >
              Cancel Delivery?
            </Text>

            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Are you sure you want to cancel this task?
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "#ccc" }]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={{ color: "black", fontWeight: "bold" }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "red" }]}
                onPress={cancelTask}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: { backgroundColor: "#2ECC71", padding: 20 },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },

  card: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },

  cardRow: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },

  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  bottom: { padding: 10, backgroundColor: "white" },

  button: {
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "white", fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: "red" },

  line: { width: 2, flex: 1, backgroundColor: "#ccc" },

  place: { fontSize: 16, fontWeight: "bold" },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
  },

  done: {
    backgroundColor: "#2ECC71",
    borderColor: "#2ECC71",
  },

  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: "#ccc",
    marginLeft: 6,
    marginVertical: 2,
  },

  stepText: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  routeRow: {
    flexDirection: "row",
  },

  routeLine: {
    alignItems: "center",
    marginRight: 12,
  },

  label: {
    fontSize: 12,
    color: "gray",
  },

  primaryBtn: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryText: {
    color: "red",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2ECC71",
  },

  emptyText: {
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
});
