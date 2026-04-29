import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getData, KEYS, removeData, saveData } from "../../../utils/storage";
export default function CurrentTask() {
  const [status, setStatus] = useState("accepted");
  const [task, setTask] = useState<any>(null);
  const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  // 🔥 LOAD TASK
  useFocusEffect(
    useCallback(() => {
      const loadTask = async () => {
        const data = await getData(KEYS.ACTIVE);
        console.log("LOADED TASK:", data);
        setTask(data);
        setStatus("accepted");
      };

      loadTask();
    }, [])
  );

  // ❌ CANCEL TASK (FIXED)
  const cancelTask = async () => {
    if (!task) return;

    const available = (await getData(KEYS.AVAILABLE)) ?? [];

    await saveData(KEYS.AVAILABLE, [...available, task]);
    await removeData(KEYS.ACTIVE);

    setTask(null);
    setShowCancelModal(false);
  };

  // 🚀 DELIVERY FLOW
  const handleAction = async () => {
    if (status === "accepted") {
      setStatus("picked_up");
    } else if (status === "picked_up") {
      const history = (await getData(KEYS.HISTORY)) ?? [];

      const completedTask = {
        ...task,
        completedAt: new Date().toISOString(),
        earnings: 40,
        paid: false, // 🔥 default unpaid
      };

      await saveData(KEYS.HISTORY, [completedTask, ...history]);
      await removeData(KEYS.ACTIVE);

      setShowDeliveredPopup(true);
    }
  };

  // 📍 MAP
  const openMaps = () => {
    if (!task) return;

    const destination =
      status === "accepted" ? task.restaurant : task.ngo;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;

    Linking.openURL(url);
  };

  // TEXT
  const getButtonText = () => {
    if (status === "accepted") return "Mark Picked Up";
    if (status === "picked_up") return "Mark Delivered";
    return "";
  };

  // 🧠 EMPTY STATE
  if (!task) {
    return (
      <View style={styles.center}>
        <Text>No Active Task</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Current Delivery</Text>
        </View>

        {/* MAP */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <TouchableOpacity style={styles.button} onPress={openMaps}>
            <Text style={styles.buttonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 ROUTE (FIXED UI) */}
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
              <Text style={styles.place}>{task.restaurant}</Text>

              <Text style={[styles.label, { marginTop: 16 }]}>Drop</Text>
              <Text style={styles.place}>{task.ngo}</Text>
            </View>
          </View>
        </View>

        {/* 🔥 STATUS (FIXED UI) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          {/* STEP 1 */}
          <View style={styles.stepRow}>
            <View style={[styles.circle, styles.done]} />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Accepted</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          {/* STEP 2 */}
          <View style={styles.stepRow}>
            <View style={[styles.circle, status === "picked_up" && styles.done]} />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Picked Up</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          {/* STEP 3 */}
          <View style={styles.stepRow}>
            <View style={styles.circle} />
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Delivered</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ACTION BUTTONS */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleAction}>
          <Text style={styles.primaryText}>{getButtonText()}</Text>
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

      {/* DELIVERY POPUP */}
      <Modal visible={showDeliveredPopup} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              ✅ Order Delivered
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowDeliveredPopup(false);
                setTask(null);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ❌ CANCEL CONFIRMATION MODAL */}
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

// 🎨 STYLES
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

  cancel: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  cancelText: { color: "red", fontWeight: "bold" },

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

  routeContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 10
  },

  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: "green" },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: "red" },

  line: { width: 2, flex: 1, backgroundColor: "#ccc" },

  placeTitle: { fontSize: 12, color: "gray" },
  place: { fontSize: 16, fontWeight: "bold" },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },
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