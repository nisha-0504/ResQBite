import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { getData, getStats, KEYS, saveData } from "../../../utils/storage";
interface DetailRowProps {
  label: string;
  value: string | number | undefined | null; // Allows for any data type coming from your Task
}
interface User {
  name: string;
}
interface Task {
  id: number;
  restaurant: string;
  ngo: string;
  distance: number;
  quantity: number;
  time: string;
  priority: number;
  notes?: string;
  vehicle?: string;
}
export default function Home() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; text: string }[]
  >([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null); // Change this from 'null' to <User | null>(null)
  const [stats, setStats] = useState({
    deliveries: 0,
    meals: 0,
    people: 0,
  });

  // Load Tasks, User, and Stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadAllData = async () => {
        try {
          const [taskData, userData, statsData] = await Promise.all([
            getData(KEYS.AVAILABLE),
            getData("USER"),
            getStats(),
          ]);

          if (taskData) setTasks(taskData);
          if (userData) setUser(userData);
          if (statsData) setStats(statsData);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      loadAllData();
    }, []),
  );

  // Sync Notifications whenever tasks change
  useEffect(() => {
    const notifs = tasks.map((task) => ({
      id: task.id,
      text: `New task from ${task.restaurant}`,
    }));
    setNotifications(notifs);
  }, [tasks]);

  // Initial Seed Data (Only if empty)
  useEffect(() => {
    const seedData = async () => {
      const existing = await getData(KEYS.AVAILABLE);
      if (!existing || existing.length === 0) {
        await saveData(KEYS.AVAILABLE, [
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
          },
        ]);
        // Refresh local state after seeding
        const freshData = await getData(KEYS.AVAILABLE);
        setTasks(freshData);
      }
    };
    seedData();
  }, []);

  const handleAccept = async (task:Task) => {
    try {
      // ✅ SAVE TASK HERE
      await saveData(KEYS.ACTIVE, task);

      const check = await getData(KEYS.ACTIVE);
      console.log("SAVED TASK:", check);

      // ✅ REMOVE FROM AVAILABLE
      const available = (await getData(KEYS.AVAILABLE)) ?? [];
      const updated = available.filter((t:Task) => t.id !== task.id);

      await saveData(KEYS.AVAILABLE, updated);

      setTasks(updated);
      setModalVisible(false);

      // ✅ NAVIGATE
      router.push("/(volunteer)/(tabs)/current_task");
    } catch (error) {
      console.error(error);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.distance - b.distance;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={uiStyles.header}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
                Hi, {user?.name || "Volunteer"} 👋
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

        <View style={{ height: 60 }} />

        {/* STATS */}
        <View style={uiStyles.statsRow}>
          {[
            { icon: "bicycle", value: stats.deliveries, label: "Deliveries" },
            { icon: "trending-up", value: stats.meals, label: "Meals" },
            { icon: "people", value: stats.people, label: "People" },
          ].map((item, index) => (
            <View key={index} style={uiStyles.statsCard}>
              <Ionicons name={item.icon as any} size={22} color="#2ECC71" />
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
            Available Tasks
          </Text>

          {sortedTasks.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
              No available tasks at the moment.
            </Text>
          ) : (
            sortedTasks.map((task) => (
              <View key={task.id} style={uiStyles.taskCard}>
                <Text style={{ fontWeight: "bold" }}>
                  Food Pickup & Delivery
                </Text>
                <Text style={{ color: "#6B7280" }}>
                  {task.restaurant} → {task.ngo}
                </Text>
                <Text>Distance: {task.distance} km</Text>

                <Pressable
                  onPress={() => {
                    setSelectedTask(task);
                    setModalVisible(true);
                  }}
                  style={uiStyles.viewDetailsBtn}
                >
                  <Text style={{ color: "#fff" }}>View Details</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL (POPUP) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={uiStyles.modalOverlay}>
          <View style={uiStyles.modalContent}>
            <View style={uiStyles.modalHeader}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Task Details
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            <View style={uiStyles.detailContainer}>
              <DetailRow label="Restaurant:" value={selectedTask?.restaurant} />
              <DetailRow label="NGO:" value={selectedTask?.ngo} />
              <DetailRow
                label="Distance:"
                value={`${selectedTask?.distance} km`}
              />
              <DetailRow label="Quantity:" value={selectedTask?.quantity} />
              <DetailRow label="Time:" value={selectedTask?.time} />
              {selectedTask?.notes && (
                <DetailRow label="Notes:" value={selectedTask?.notes} />
              )}
            </View>

            <Pressable
              onPress={() => selectedTask && handleAccept(selectedTask)}
              style={uiStyles.acceptBtn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Accept Task
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal visible={notifVisible} transparent animationType="fade">
        <View style={uiStyles.modalOverlay}>
          <View style={uiStyles.modalContent}>
            <View style={uiStyles.modalHeader}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Notifications
              </Text>
              <Pressable onPress={() => setNotifVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            {notifications.length === 0 ? (
              <Text style={{ marginTop: 20, color: "#6B7280" }}>
                No notifications
              </Text>
            ) : (
              notifications.map((item) => (
                <View key={item.id} style={uiStyles.notifItem}>
                  <Text style={{ flex: 1 }}>{item.text}</Text>
                  <Pressable
                    onPress={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== item.id),
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

// Helper Component for Modal Rows
const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={uiStyles.detailRow}>
    <Text style={uiStyles.detailKey}>{label}</Text>
    <Text style={uiStyles.detailValue}>
      {/* The 'toString()' ensures TypeScript is happy even if value is a number */}
      {value !== undefined && value !== null ? value.toString() : "-"}
    </Text>
  </View>
);

const uiStyles = StyleSheet.create({
  header: {
    backgroundColor: "#2ECC71",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 0,
    paddingHorizontal: 10,
  },

  statsCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    width: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 15,
    elevation: 3,
  },

  viewDetailsBtn: {
    marginTop: 10,
    backgroundColor: "#FF8C42",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailContainer: {
    marginTop: 12,
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  detailKey: {
    fontWeight: "600",
    color: "#374151",
    width: 110,
  },

  detailValue: {
    color: "#6B7280",
    flex: 1,
  },

  acceptBtn: {
    marginTop: 15,
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  notifItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
  },
});
