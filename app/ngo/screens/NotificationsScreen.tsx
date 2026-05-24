import { View, Text, FlatList, StyleSheet } from "react-native";

import { useEffect, useState } from "react";

import API from "../../../services/api";

const COLORS = {
  primary: "#2fb463",
  secondary: "#ff7a3d",
  background: "#f5f7f6",
  white: "#fff",
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const fetchNotifications = async () => {
    try {
      const pendingRes = await API.get("/ngo/donations");

      const activeRes = await API.get("/ngo/active");

      const pendingNotifications = pendingRes.data.map((item: any) => ({
        id: item._id,

        title: "New Food Available",

        msg: `${item.foodType} donation added`,

        time: new Date(item.createdAt).toLocaleString(),
      }));

      const acceptedNotifications = activeRes.data.map((item: any) => ({
        id: item._id + "accepted",

        title: "Donation Accepted",

        msg: `You accepted ${item.foodType}`,

        time: new Date(item.updatedAt).toLocaleString(),
      }));

      setNotifications([...acceptedNotifications, ...pendingNotifications]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>

          <Text style={styles.emptyTitle}>No Notifications Yet</Text>

          <Text style={styles.emptyText}>
            New donation alerts will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.dot} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <Text style={styles.msg}>{item.msg}</Text>

                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 12,
    padding: 14,
    borderRadius: 14,
    elevation: 3,
  },

  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#ff7a3d",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 6,
  },

  cardTitle: {
    fontWeight: "bold",
    color: "#2fb463",
  },

  msg: {
    color: "#555",
    marginTop: 2,
  },

  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    color: "#2fb463",
  },

  emptyText: {
    marginTop: 6,
    color: "#777",
    textAlign: "center",
  },
});
