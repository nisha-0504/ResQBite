import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, ComponentProps } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

// This extracts valid names from Ionicons to stop the "underlined name" error
type IconName = ComponentProps<typeof Ionicons>['name'];

interface DetailRowProps {
  label: string;
  value: string | number | undefined | null;
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
  icon: IconName; // Added this
  notes?: string;
  vehicle?: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [stats, setStats] = useState({
    deliveries: 0,
    meals: 0,
    people: 0,
  });

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; text: string }[]
  >([]);
  const [user, setUser] = useState<User | null>(null);

  // Added the 'icon' property to every task to match the interface
  const tasks: Task[] = [
    {
      id: 1,
      restaurant: "A2B",
      ngo: "Care Center",
      distance: 2,
      quantity: 20,
      time: "6 PM",
      priority: 2,
      icon: "fast-food", 
      notes: "Handle carefully",
      vehicle: "Bike",
    },
    {
      id: 2,
      restaurant: "Green Leaf",
      ngo: "Hope NGO",
      distance: 5,
      quantity: 40,
      time: "7 PM",
      priority: 1,
      icon: "leaf",
      notes: "Urgent",
      vehicle: "Bike",
    },
    {
      id: 3,
      restaurant: "Dominos",
      ngo: "Food Shelter",
      distance: 3,
      quantity: 15,
      time: "5 PM",
      priority: 3,
      icon: "pizza",
      notes: "Fragile",
      vehicle: "Scooter",
    },
  ];

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.distance - b.distance;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#2ECC71",
            padding: 20,
            paddingTop: 60,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
                Hi, Raj 👋
              </Text>
              <Text style={{ color: "#E8F5E9", marginTop: 5 }}>
                Ready to Help Today?
              </Text>
            </View>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </View>
        </View>

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
            paddingHorizontal: 10,
          }}
        >
          {([
            { icon: "bicycle", value: "45", label: "Deliveries" },
            { icon: "trending-up", value: "680", label: "Meals" },
            { icon: "ribbon", value: "1250", label: "Points" },
          ] as { icon: IconName; value: string; label: string }[]).map((item, index) => (
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                 <Ionicons name={task.icon} size={20} color="#2ECC71" />
                 <Text style={{ fontWeight: "bold" }}>Food Pickup & Delivery</Text>
              </View>

              <Text style={{ color: "#6B7280", marginTop: 4 }}>
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

      {/* MODAL */}
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
                marginBottom: 15
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Task Details
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={{ padding: 5 }}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            <Text>🍽 Restaurant: {selectedTask?.restaurant}</Text>
            <Text>🏠 NGO: {selectedTask?.ngo}</Text>
            <Text>📍 Distance: {selectedTask?.distance} km</Text>
            <Text>🍱 Quantity: {selectedTask?.quantity}</Text>
            <Text>⏰ Time: {selectedTask?.time}</Text>
            <Text>📝 Notes: {selectedTask?.notes}</Text>
            <Text>🚲 Vehicle: {selectedTask?.vehicle}</Text>

            <Pressable
  onPress={() => {
    if (selectedTask) {
      setModalVisible(false);
      // Pass the ID as a query parameter
      router.push({
        pathname: "/active",
        params: { taskId: selectedTask.id }
      });
    }
  }}
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
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Text style={{ color: "#6B7280" }}>Reject</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}