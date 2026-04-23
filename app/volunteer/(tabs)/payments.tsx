import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getData, KEYS } from "../../../utils/storage";

// 🧠 Helper: get week range
const getWeekRange = (dateStr: string) => {
  const date = new Date(dateStr);
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toDateString().slice(4, 10)} → ${end
    .toDateString()
    .slice(4, 10)}`;
};

export default function PaymentsScreen() {
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);

  // 🔥 LOAD + GROUP DATA
  useFocusEffect(
    useCallback(() => {
      const loadPayments = async () => {
        const history = ((await getData(KEYS.HISTORY)) || []).sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );

        const grouped: any = {};

        history.forEach((task: any, index: number) => {
          const week = getWeekRange(task.completedAt);

          if (!grouped[week]) {
            grouped[week] = {
              id: week,
              week,
              total: 0,
              orders: []
            };
          }

          const order = {
            id: index.toString(),
            route: `${task.restaurant} → ${task.ngo}`,
            distance: `${task.distance} km`,
            fee: task.earnings || 0,
            date: new Date(task.completedAt).toISOString(),
            paid: task.paid ?? false, // 🔥 IMPORTANT
          };

          grouped[week].orders.push(order);
          grouped[week].total += order.fee;
        });


        // 🔥 SORT ORDERS INSIDE WEEK
        Object.values(grouped).forEach((week: any) => {
          week.orders.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        Object.values(grouped).forEach((week: any) => {
          const allPaid = week.orders.every((o: any) => o.paid);
          week.status = allPaid ? "Paid" : "Unpaid";
        });

        setPayments(Object.values(grouped));
      };

      loadPayments();
    }, [])
  );

  // 🔍 SEARCH
  const filteredPayments = payments.filter((item: any) =>
    item.week.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Payments</Text>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search by date (e.g. Mar, 18)"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* EMPTY */}
      {filteredPayments.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No payments yet
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedWeek(item)}
          >
            <View>
              <Text style={styles.week}>{item.week}</Text>
              <Text
                style={{
                  color: item.status === "Paid" ? "#2ECC71" : "red",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.amount}>₹{item.total}</Text>
          </TouchableOpacity>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selectedWeek} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>

            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>
                {selectedWeek?.week}
              </Text>

              <TouchableOpacity onPress={() => setSelectedWeek(null)}>
                <Text style={styles.close}>❌</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedWeek?.orders || []}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => (
                <View style={styles.orderCard}>

                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.route}>{item.route}</Text>

                  <View style={styles.row}>
                    <Text>{item.distance}</Text>
                    <Text style={styles.fee}>₹{item.fee}</Text>
                    <Text
                      style={{
                        color: item.paid ? "#2ECC71" : "red",
                        fontWeight: "bold",
                        marginTop: 4
                      }}
                    >
                      {item.paid ? "Paid" : "Unpaid"}
                    </Text>
                  </View>

                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ✅ STYLES (IMPORTANT - DO NOT DELETE)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#2ecc71",
    padding: 20
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },

  search: {
    backgroundColor: "white",
    margin: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2
  },

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

  week: {
    fontWeight: "bold",
    fontSize: 14
  },

  amount: {
    fontWeight: "bold",
    fontSize: 16
  },

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

  popupTitle: {
    fontWeight: "bold",
    fontSize: 16
  },

  close: {
    fontSize: 18
  },

  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6
  },

  date: {
    fontSize: 12,
    color: "gray",
    marginBottom: 2
  },

  route: {
    fontWeight: "600",
    marginBottom: 5
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  fee: {
    fontWeight: "bold"
  }
});

