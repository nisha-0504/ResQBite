import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { getData, getStats, KEYS, saveData } from "./utils/storage";

export default function Home() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    deliveries: 0,
    meals: 0,
    people: 0
  });
  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const data = await getData(KEYS.AVAILABLE);
        setTasks(data || []);
      };

      loadTasks();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const data = await getData("USER");
        setUser(data);
      };

      loadUser();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        const data = await getStats();
        setStats(data);
      };

      loadStats();
    }, [])
  );
  useEffect(() => {
    const notifs = tasks.map((task) => ({
      id: task.id,
      text: `New task from ${task.restaurant}`,
    }));
    setNotifications(notifs);
  }, [tasks]);
  useEffect(() => {
    saveData(KEYS.AVAILABLE, [
      {
        id: 1,
        restaurant: "A2B",
        ngo: "Care Center",
        distance: 2,
        quantity: 20,
        time: "6 PM",
        priority: 2,
      },
      {
        id: 2,
        restaurant: "Dominos",
        ngo: "Food Shelter",
        distance: 3,
        quantity: 15,
        time: "5 PM",
        priority: 1,
      }
    ]);
  }, []);
  const handleAccept = async (task) => {
    // 1. Save active task
    await saveData(KEYS.ACTIVE, task);

    // 2. Remove from available
    const tasks = await getData(KEYS.AVAILABLE) || [];
    const updated = tasks.filter((t) => t.id !== task.id);

    await saveData(KEYS.AVAILABLE, updated);

    // 3. Close modal
    setModalVisible(false);

    // 4. Navigate
    router.push("/(volunteer)/(tabs)/current_task");
  };
  {
    tasks.length === 0 && (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No available tasks
      </Text>
    )
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.distance - b.distance;
  });
  const styles = {
    detailContainer: {
      marginTop: 12,
    },

    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    key: {
      fontWeight: "600",
      color: "#374151",
    },

    value: {
      color: "#6B7280",
    },
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#2ECC71",
            padding: 20,
            paddingTop: 50,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
                Hi, {user?.name || "User"} 👋
              </Text>
              <Text style={{ color: "#E8F5E9", marginTop: 5 }}>
                Ready to Help Today?
              </Text>
            </View>

            <Pressable onPress={() => setNotifVisible(true)}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: -30,
            paddingHorizontal: 10,
          }}
        >
          {[
            { icon: "bicycle", value: stats.deliveries, label: "Deliveries" },
            { icon: "trending-up", value: stats.meals, label: "Meals" },
            { icon: "people", value: stats.people, label: "People" },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 16,
                alignItems: "center",
                width: 100,
                elevation: 5,
              }}
            >
              <Ionicons name={item.icon} size={22} color="#2ECC71" />
              <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 5 }}>
                {item.value}
              </Text>
              <Text style={{ color: "#6B7280" }}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CONTENT */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1F2933" }}>
            Available Task
          </Text>

          {/* TASK CARD */}
          {sortedTasks.map((task) => (
            <View
              key={task.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 16,
                marginTop: 15,
                elevation: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Food Pickup & Delivery</Text>

              <Text style={{ color: "#6B7280" }}>
                {task.restaurant} → {task.ngo}
              </Text>

              <Text>Distance: {task.distance} km</Text>

              <Pressable
                onPress={() => {
                  setSelectedTask(task);
                  setModalVisible(true);
                }}
                style={{
                  marginTop: 10,
                  backgroundColor: "#FF8C42",
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff" }}>View Details</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL (POPUP) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              margin: 20,
              padding: 20,
              borderRadius: 16,
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Task Details
              </Text>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ padding: 5 }}
              >
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            <View style={styles.detailContainer}>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Restaurant:</Text>
                <Text style={styles.value}>{selectedTask?.restaurant}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>NGO:</Text>
                <Text style={styles.value}>{selectedTask?.ngo}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Distance:</Text>
                <Text style={styles.value}>{selectedTask?.distance} km</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Quantity:</Text>
                <Text style={styles.value}>{selectedTask?.quantity}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Time:</Text>
                <Text style={styles.value}>{selectedTask?.time}</Text>
              </View>

              {selectedTask?.notes ? (
                <View style={styles.detailRow}>
                  <Text style={[styles.key, { width: 110 }]}>Notes:</Text>
                  <Text style={styles.value}>{selectedTask?.notes}</Text>
                </View>
              ) : null}

              <View style={styles.detailRow}>
                <Text style={[styles.key, { width: 110 }]}>Vehicle:</Text>
                <Text style={styles.value}>{selectedTask?.vehicle || "-"}</Text>
              </View>

            </View>
            {/* ACCEPT */}
            <Pressable
              onPress={() => handleAccept(selectedTask)}
              style={{
                marginTop: 15,
                backgroundColor: "#2ECC71",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Accept Task
              </Text>
            </Pressable>

            {/* REJECT */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#6B7280" }}>Reject</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal visible={notifVisible} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}>

          <View style={{
            margin: 20,
            padding: 20,
            borderRadius: 16,
            backgroundColor: "#fff"
          }}>

            {/* HEADER */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Notifications
              </Text>

              <Pressable onPress={() => setNotifVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            {/* LIST */}
            {notifications.length === 0 ? (
              <Text style={{ marginTop: 20, color: "#6B7280" }}>
                No notifications
              </Text>
            ) : (
              notifications.map((item) => (
                <View key={item.id} style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  backgroundColor: "#F9FAFB",
                  padding: 12,
                  borderRadius: 10
                }}>
                  <Text>{item.text}</Text>

                  <Pressable
                    onPress={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== item.id)
                      )
                    }
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </Pressable>
                </View>
              ))
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}
