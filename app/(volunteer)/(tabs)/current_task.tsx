import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function CurrentTask() {
  const [status, setStatus] = useState("accepted");
  const [task, setTask] = useState<any>(null);
  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadTask = async () => {
        try {
          const res = await fetch("http://192.168.0.101:5000/api/volunteer/current");
          const data = await res.json();

          setTask(data);

          if (data?.status === "picked") {
            setStatus("picked_up");
          } else if (data?.status === "accepted") {
            setStatus("accepted");
          }
        } catch (err) {
          console.log(err);
        }
      };

      loadTask();
    }, [])
  );
  useEffect(() => {
    if (!showDeliveredPopup) {
      setTask(null);
    }
  }, [showDeliveredPopup]);

  const cancelTask = async () => {
    if (!task) return;

    try {
      await fetch(`http://192.168.0.101:5000/api/volunteer/cancel/${task._id}`, {
        method: "PUT",
      });

      setTask(null);
      setShowCancelModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAction = async () => {
    if (status === "accepted") {
      try {
        await fetch(`http://192.168.0.101:5000/api/volunteer/pickup/${task._id}`, {
          method: "PUT",
        });

        setStatus("picked_up");
      } catch (err) {
        console.log(err);
      }
    } else if (status === "picked_up") {
      try {
        await fetch(`http://192.168.0.101:5000/api/volunteer/complete/${task._id}`, {
          method: "PUT",
        });

        setShowDeliveredPopup(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const openMaps = () => {
    if (!task) return;

    const destination =
      status === "accepted" ? task.restaurant : task.ngo;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
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
        <Text>No Active Task</Text>
      </View>
    );
  }
  const handleCall = async (type: "restaurant" | "ngo") => {
    const phone =
      type === "restaurant"
        ? "tel:9876543210"
        : "tel:9123456780";

    const supported = await Linking.canOpenURL(phone); // ✅ ADDED

    if (supported) {
      await Linking.openURL(phone); // ✅ UPDATED
    } else {
      console.log("Dialer not supported"); // ✅ ADDED
    }

  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>Current Delivery</Text>
        </View>

        {/* ❌ REMOVED ETA CARD */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <TouchableOpacity style={styles.button} onPress={openMaps}>
            <Text style={styles.buttonText}>
              Start Navigation (7 km • 18 min)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 ROUTE */}
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

        {/* ➕ ADDED CALL BUTTONS */}
        <View style={styles.card}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => handleCall("restaurant")} // ✅ ADDED
          >
            <Text style={{ marginRight: 10 }}>📞</Text>
            <Text>Call Restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
            onPress={() => handleCall("ngo")} // ✅ ADDED
          >
            <Text style={{ marginRight: 10 }}>📞</Text>
            <Text>Call NGO</Text>
          </TouchableOpacity>
        </View>

        {/* ❌ REMOVED SAFETY NOTE */}

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
            <View style={[styles.circle, status === "picked_up" && styles.done]} />
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
          disabled={!task}   // ✅ ADD THIS LINE
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
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
              Delivery Completed!
            </Text>

            <Text style={{ marginBottom: 20, fontSize: 16 }}>
              You earned <Text>₹60</Text>
            </Text>

            <TouchableOpacity
              style={[styles.button, { width: "50%", paddingVertical: 14 }]} // ✅ UPDATED
              onPress={() => {
                setShowDeliveredPopup(false);
              }}
            >
              <Text style={[styles.buttonText, { fontSize: 18 }]}>Close</Text> // ✅ UPDATED
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
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

// STYLES UNCHANGED
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: { backgroundColor: "#2ECC71", padding: 20 },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },

  card: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10
  },

  cardRow: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10
  },

  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  bottom: { padding: 10, backgroundColor: "white" },

  button: {
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  buttonText: { color: "white", fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },

  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center"
  },

  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: "green" },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: "red" },

  line: { width: 2, flex: 1, backgroundColor: "#ccc" },

  place: { fontSize: 16, fontWeight: "bold" },

  stepRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10
  },

  done: {
    backgroundColor: "#2ECC71",
    borderColor: "#2ECC71"
  },

  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: "#ccc",
    marginLeft: 6,
    marginVertical: 2
  },

  stepText: {
    flex: 1
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "600"
  },

  routeRow: {
    flexDirection: "row"
  },

  routeLine: {
    alignItems: "center",
    marginRight: 12
  },

  label: {
    fontSize: 12,
    color: "gray"
  },

  primaryBtn: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  primaryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },

  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  },

  secondaryText: {
    color: "red",
    fontWeight: "bold"
  }
});