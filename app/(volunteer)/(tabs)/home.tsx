import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface DetailRowProps {
  label: string;
  value: string | number | undefined | null;
}

interface User {
  name: string;
}

interface Task {
  restaurant: string;
  ngo: string;
  distance: number;
  quantity: number;
  time: string;
  notes?: string;
  _id: string;
  earnings?: number;
  urgency?: string;
}

export default function Home() {
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; text: string }[]
  >([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    deliveries: 0,
    meals: 0,
    earnings: 0,
  });

  // ❌ REMOVED loadingTaskId
  // ❌ REMOVED acceptedTaskId

  useFocusEffect(
    useCallback(() => {
      const loadAllData = async () => {
        try {
          const res = await fetch(
            "http://192.168.0.101:5000/api/volunteer/available"
          );
          const data = await res.json();
          setTasks(data || []);

          const name = await AsyncStorage.getItem("userName");
          if (name && name.trim() !== "") {
            setUser({ name });
          }

          const res2 = await fetch(
            "http://192.168.0.101:5000/api/volunteer/history"
          );
          const history = await res2.json();

          const deliveries = history.length;
          const meals = history.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
          );
          const earnings = history.reduce(
            (sum: number, item: any) => sum + (item.earnings || 0),
            0
          );

          setStats({ deliveries, meals, earnings });
        } catch (error) {
          console.error(error);
        }
      };

      loadAllData();
    }, [])
  );

  useEffect(() => {
    const notifs = tasks.map((task) => ({
      id: task._id,
      text: `New task from ${task.restaurant}`,
    }));
    setNotifications(notifs);
  }, [tasks]);

  const handleAccept = async (task: Task) => {
    try {
      await fetch(
        `http://192.168.0.101:5000/api/volunteer/pickup/${task._id}`,
        {
          method: "PUT",
        }
      );

      setModalVisible(false);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      router.push("/(volunteer)/(tabs)/current_task");
    } catch (error) {
      console.error(error);
    }
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => (a.distance || 0) - (b.distance || 0)
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={uiStyles.header}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 30, fontWeight: "bold", color: "#fff" }}>
                Welcome, {user?.name || "Volunteer"} 👋
              </Text>
              <Text style={{ color: "#E8F5E9", marginTop: 8 }}>
                Ready to Help Today?
              </Text>
            </View>

            <Pressable onPress={() => setNotifVisible(true)}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 30, marginBottom: 10 }}>
          {[
            { icon: "bicycle", value: stats.deliveries, label: "Deliveries" },
            { icon: "trending-up", value: stats.meals, label: "Meals" },
            {
              icon: "cash",
              value: `₹${stats.earnings}`,
              label: "Earnings Today",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 14,
                paddingHorizontal: 10,
                borderRadius: 16,
                width: 118,
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Ionicons
                name={
                  item.label === "Deliveries"
                    ? "bicycle-outline"
                    : item.label === "Meals"
                      ? "restaurant-outline"
                      : "cash-outline"
                }
                size={22}
                color="#2ECC71"
              />              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.value}
              </Text>
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>

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
              <View key={task._id} style={uiStyles.taskCard}>
                <Text style={{ fontWeight: "bold" }}>
                  Food Pickup & Delivery
                </Text>
                <Text style={{ color: "#6B7280" }}>
                  {task.restaurant} → {task.ngo}
                </Text>

                <Text>
                  {(task?.distance ?? 0)} km • ₹{task?.earnings ?? 0} {task?.time || ""}
                </Text>

                <Text>
                  {task.urgency === "urgent" ? "Urgent" : "Normal"}
                </Text>

                <Pressable
                  onPress={() => {
                    setSelectedTask(task);
                    setModalVisible(true);
                  }}
                  style={uiStyles.viewDetailsBtn}
                >
                  <Text style={{ color: "#fff" }}>
                    View Details {/* ✅ UPDATED */}
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODALS unchanged */}

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
              <DetailRow
                label="Earnings:"
                value={`₹${selectedTask?.earnings || 0}`} // ➕ ADDED
              />
              <DetailRow
                label="Pickup Deadline:"
                value={selectedTask?.time} // ➕ ADDED
              />
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
                  <Text style={{ flex: 1 }}>{item?.text || ""}</Text>
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

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={uiStyles.detailRow}>
    <Text style={uiStyles.detailKey}>{label}</Text>
    <Text style={uiStyles.detailValue}>
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
    minHeight: 140, // ➕ ADDED
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