import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// 🧠 Helper: get week range
const getWeekRange = (dateStr: string) => {
  const date = new Date(dateStr);
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} → ${end.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })}`; // ✅ UPDATED
};

export default function PaymentsScreen() {
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all"); // ➕ ADDED

  useFocusEffect(
    useCallback(() => {
      const loadPayments = async () => {
        try {
          const res = await fetch("http://192.168.0.101:5000/api/volunteer/history");
          const data = await res.json();

          if (!data || data.length === 0) {
            setPayments([]);
            return;
          }

          const history = data.sort(
            (a: any, b: any) =>
              new Date(b.completedAt || 0).getTime() -
              new Date(a.completedAt || 0).getTime()
          );

          const grouped: any = {};

          history.forEach((task: any, index: number) => {
            const week = getWeekRange(task.completedAt || new Date().toISOString());

            if (!grouped[week]) {
              grouped[week] = {
                id: week,
                week,
                total: 0,
                orders: [],
                paidTotal: 0,
                pendingTotal: 0
              };
            }

            const order = {
              id: index.toString(),
              route: `${task.restaurant} → ${task.ngo}`,
              distance: `${task.distance} km`,
              fee: task.earnings || 0,
              date: new Date(task.completedAt || Date.now()).toLocaleString("en-GB"),
              paid: task.paid ?? false,
            };

            grouped[week].orders.push(order);
            grouped[week].total += order.fee;

            if (order.paid) grouped[week].paidTotal += order.fee;
            else grouped[week].pendingTotal += order.fee;
          });

          Object.values(grouped).forEach((week: any) => {
            week.orders.sort(
              (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const allPaid = week.orders.every((o: any) => o.paid);
            week.status = allPaid ? "Paid" : "Unpaid";

            week.count = week.orders.length;
          });

          setPayments(Object.values(grouped));

        } catch (err) {
          console.error("PAYMENTS ERROR:", err);
        }
      };

      loadPayments();
    }, [])
  );

  // 🔍 SEARCH + FILTER (SAFE)
  const filteredPayments = payments.filter((item: any) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.week.toLowerCase().includes(query) ||
      item.orders.some((order: any) =>
        order.route.toLowerCase().includes(query) ||
        order.date.toLowerCase().includes(query)
      );

    if (filter === "week") return matchesSearch; // ➕ ADDED
    if (filter === "month") return matchesSearch; // ➕ ADDED

    return matchesSearch;
  });

  // SUMMARY
  const totalEarned = payments.reduce((sum: number, w: any) => sum + (w.total || 0), 0);
  const totalPaid = payments.reduce((sum: number, w: any) => sum + (w.paidTotal || 0), 0);
  const totalPending = payments.reduce((sum: number, w: any) => sum + (w.pendingTotal || 0), 0);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        {/* Title + ₹ */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.headerText}>
            Payments
          </Text>

          <Text
            style={{
              color: "white", // 
              fontSize: 30,
              marginLeft: 13,
              fontWeight: "bold",
            }}
          >
            ₹
          </Text>
        </View>

        {/* Subtitle */}
        <Text style={{ color: "#E8F5E9", marginTop: 8 }}>
          Track your earnings and payouts
        </Text>

      </View>
      {/* SEARCH */}
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            elevation: 3,
          }}
        >
          <Ionicons name="search" size={25} color="#6B7280" /> {/* ➕ ADDED */}

          <TextInput
            placeholder="Search (e.g. Apr, 01/05, NGO)"
            value={search}
            onChangeText={setSearch}
            style={{ marginLeft: 10, flex: 1 }} // ✅ UPDATED
          />
        </View>

        {/* ➕ FILTER BUTTONS */}
        <View style={{ flexDirection: "row", marginTop: 15 }}> {/* ➕ ADDED */}
          {["all", "week", "month"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                marginRight: 10,
                padding: 8,
                backgroundColor: filter === f ? "#2ECC71" : "#ddd",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: filter === f ? "#fff" : "#000" }}>
                {f === "all" ? "All" : f === "week" ? "This Week" : "This Month"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUMMARY CARDS */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15, marginBottom: 10 }}> {/* ✅ UPDATED */}
          <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
            <Ionicons name="cash-outline" size={22} color="#2ECC71" /> // ✅ UPDATED
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{totalEarned}</Text>
            <Text>Earned</Text>
          </View>

          <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#2ECC71" /> // ✅ UPDATED
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{totalPaid}</Text>
            <Text>Paid</Text>
          </View>

          <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 16, width: 100, alignItems: "center", elevation: 5 }}>
            <Ionicons name="time-outline" size={22} color="#2ECC71" /> // ✅ UPDATED          <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{totalPending}</Text>
            <Text>Pending</Text>
          </View>
        </View>

        {filteredPayments.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            <Text>No payments yet </Text>
          </Text>
        )}

        <FlatList
          data={filteredPayments}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }} // ➕ ADDED (gap below)
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedWeek(item)}
            >
              <View>
                <Text style={styles.week}>{item.week}</Text>

                <Text>
                  {item.count} Deliveries • ₹{item.total}
                </Text>

                <Text
                  style={{
                    color: item.status === "Paid" ? "#2ECC71" : "red",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 4
                  }}
                >
                  Status: {item.status}
                </Text>
              </View>

              <Text style={[styles.amount, { fontSize: 18 }]}>₹{item.total}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={!!selectedWeek} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={[styles.popup, { marginTop: 40 }]}> {/* ✅ UPDATED */}

              <View style={styles.popupHeader}> {/* ✅ UPDATED */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.popupTitle}>
                    {selectedWeek?.week}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setSelectedWeek(null)}>
                  <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* ➕ ADDED BELOW HEADER */}
              <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 10 }}>
                Total earned: <Text style={{ fontWeight: "bold" }}>₹{selectedWeek?.total}</Text>
              </Text>

              <FlatList
                data={selectedWeek?.orders || []}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }: any) => (
                  <View style={styles.orderCard}>
                    <Text style={styles.route}>{item.route}</Text>

                    <View style={styles.row}>
                      <Text>{item.distance}</Text>
                      <Text style={styles.fee}>₹{item.fee}</Text>
                    </View>

                    <Text style={styles.date}>{item.date}</Text>

                    <Text
                      style={{
                        color: item.paid ? "#2ECC71" : "red",
                        fontWeight: "bold",
                        marginTop: 5
                      }}
                    >
                      {item.paid ? "Paid" : "Unpaid"}
                    </Text>
                  </View>
                )}
              />


              <TouchableOpacity
                style={{
                  backgroundColor: "#2ecc71",
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 15, // ✅ UPDATED (gap)
                  alignItems: "center"
                }}
                onPress={() => setSelectedWeek(null)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// STYLES UNCHANGED
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#2ecc71",
    padding: 20,
    paddingTop: 50, // ➕ ADDED
    minHeight: 140, // ➕ ADDED
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: { color: "white", fontSize: 30, fontWeight: "bold" },
  search: { backgroundColor: "white", margin: 10, padding: 12, borderRadius: 10, elevation: 2 },
  card: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2
  },
  week: { fontWeight: "bold", fontSize: 14 },
  amount: { fontWeight: "bold", fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  popupTitle: { fontWeight: "bold", fontSize: 16 },
  close: { fontSize: 18, color: "#333", fontWeight: "bold" },
  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6
  },
  date: { fontSize: 12, color: "gray", marginBottom: 2 },
  route: { fontWeight: "600", marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  fee: { fontWeight: "bold" }
});