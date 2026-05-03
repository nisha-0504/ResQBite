import { View, Text, FlatList, StyleSheet } from "react-native";

const COLORS = {
  primary: "#2fb463",
  secondary: "#ff7a3d",
  background: "#f5f7f6",
  white: "#fff",
};

const data = [
  {
    id: "1",
    title: "New Food Available",
    msg: "Restaurant ABC added food",
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Pickup Reminder",
    msg: "Pickup from XYZ Cafe",
    time: "10 min ago",
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <FlatList
        data={data}
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
});