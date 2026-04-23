import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const historyData = [
  {
    id: "1",
    name: "Restaurant ABC",
    meals: "30 meals",
    volunteer: "Raj Kumar",
    date: "March 14, 2026",
  },
  {
    id: "2",
    name: "Hotel Green Leaf",
    meals: "50 meals",
    volunteer: "Priya Sharma",
    date: "March 13, 2026",
  },
  {
    id: "3",
    name: "Food Plaza",
    meals: "25 meals",
    volunteer: "Amit Singh",
    date: "March 12, 2026",
  },
];

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pickup History</Text>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {historyData.map((item) => (
          <View key={item.id} style={styles.card}>
            
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={18} color="#2fb463" />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>

              <View style={styles.row}>
                <Ionicons name="cube-outline" size={14} color="#777" />
                <Text style={styles.subText}> {item.meals}</Text>
              </View>

              <Text style={styles.subText}>
                Volunteer: {item.volunteer}
              </Text>

              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  header: {
    backgroundColor: "#2fb463",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    elevation: 3,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f7ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  title: {
    fontWeight: "bold",
    fontSize: 15,
  },

  subText: {
    color: "#666",
    marginTop: 3,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
  },
});