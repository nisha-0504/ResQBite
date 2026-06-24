import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../config";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";


interface User {
  name: string;
}

interface Task {
  _id: string;

  title?: string;

  foodType?: string;

  quantity: number;

  location?: string;

  restaurant?: string;

  ngo?: string;

  ngoAddress?: string;

  distance?: number;

  images?: string[];

  earnings?: number;

  urgency?: string;

  pickupTime?: string;

  expiryTime?: string;

  description?: string;

  status?: string;
  notes?: string;
}
interface DetailRowProps {
  label: string;
  value: string | number | undefined | null;
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

  useFocusEffect(
    useCallback(() => {
      const loadAllData = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          const token = await AsyncStorage.getItem("token");
          if (!storedUser) {
            console.log("No user found");
            return;
          }

          const user = JSON.parse(storedUser);
          fetch(`${BASE_URL}/api/volunteer/available`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser({
            name: user.name,
          });
          const resTasks = await fetch(`${BASE_URL}/api/volunteer/available`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const tasksData = await resTasks.json();

          setTasks(tasksData || []);

          const resHistory = await fetch(`${BASE_URL}/api/volunteer/history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const history = await resHistory.json();

          const deliveries = history.length;
          const meals = history.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0,
          );
          const today = new Date().toDateString();

          const earnings = history
            .filter(
              (item: any) =>
                item.completedAt &&
                new Date(item.completedAt).toDateString() === today
            )
            .reduce(
              (sum: number, item: any) =>
                sum + (item.earnings || 0),
              0
            );

          setStats({ deliveries, meals, earnings });
        } catch (error) {
          console.error(error);
        }
      };

      loadAllData();
    }, []),
  );

  useEffect(() => {
    const notifs = tasks.map((task) => ({
      id: task._id,
      text: `New ${task.foodType || "food"} donation available`,
    }));
    setNotifications(notifs);
  }, [tasks]);

  const handleAccept = async (task: Task) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (!storedUser) return;

      let lat = undefined;
      let lng = undefined;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          lng = loc.coords.longitude;
        }
      } catch (e) {
        console.log("Error getting location on accept:", e);
      }

      await fetch(`${BASE_URL}/api/volunteer/pickup/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          volunteerLatitude: lat,
          volunteerLongitude: lng,
        }),
      });

      setModalVisible(false);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      router.push("/(volunteer)/(tabs)/current_task");
    } catch (error) {
      console.error(error);
    }
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => (a.distance || 0) - (b.distance || 0),
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
                Welcome, {user?.name ? String(user.name) : "Volunteer"} 👋
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 30,
            marginBottom: 10,
          }}
        >
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
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
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
            <View style={uiStyles.emptyContainer}>
              <Text style={uiStyles.emptyIcon}>🚴</Text>

              <Text style={uiStyles.emptyTitle}>No Tasks Available</Text>

              <Text style={uiStyles.emptyText}>
                New pickup tasks will appear here
              </Text>
            </View>
          ) : (
            sortedTasks.map((task) => (
              <View key={task._id} style={uiStyles.taskCard}>
                <Text style={{ fontWeight: "bold" }}>
                  Food Pickup & Delivery
                </Text>
                <Text style={{ color: "#6B7280" }}>
                  {task.foodType || task.title}
                </Text>

                <Text>📍 {task.location || "Location unavailable"}</Text>

                <Text>{task.urgency === "urgent" ? "Urgent" : "Normal"}</Text>

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
              <DetailRow label="Food Type:" value={selectedTask?.foodType} />
              <DetailRow
                label="Donor:"
                value={selectedTask?.restaurant}
              />

              <DetailRow
                label="NGO:"
                value={selectedTask?.ngo}
              />
              <DetailRow
                label="Donor Address:"
                value={selectedTask?.location}
              />
              <DetailRow
                label="Donor -> NGO:"
                value={`${selectedTask?.distance ?? 0} km`}
              />
              <DetailRow
                label="NGO Address:"
                value={selectedTask?.ngoAddress}
              />
              <DetailRow label="Quantity:" value={selectedTask?.quantity} />
              <DetailRow
                label="Pickup Time:"
                value={
                  selectedTask?.pickupTime
                    ? `${new Date(selectedTask.pickupTime).toLocaleDateString()}  ${new Date(selectedTask.pickupTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                    : "-"
                }
              />
              <DetailRow
                label="Earnings:"
                value={`₹${selectedTask?.earnings || 0}`}
              />
              <DetailRow
                label="Pickup Deadline:"
                value={
                  selectedTask?.expiryTime
                    ? `${new Date(selectedTask.expiryTime).toLocaleDateString()}  ${new Date(selectedTask.expiryTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                    : "-"
                }
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
    minHeight: 140,
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
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ECC71",
    marginTop: 10,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
});
