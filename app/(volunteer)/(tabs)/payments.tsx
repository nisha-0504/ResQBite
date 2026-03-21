import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Payments() {
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const RATE_PER_KM = 10;

  // ✅ SAMPLE DATA
  const payments = [
    {
      id: "PAY001",
      date: "20 Mar, 2026",
      status: "Paid",
      method: "UPI",
      deliveries: [{ distance: 2 }, { distance: 3 }, { distance: 1 }],
    },
    {
      id: "PAY002",
      date: "13 Mar, 2026",
      status: "Pending",
      method: "Wallet",
      deliveries: [{ distance: 4 }, { distance: 2 }],
    },
  ];

  // ✅ SEARCH FILTER
  const filteredData = payments.filter(
    (item) =>
      item.date?.toLowerCase().includes(search.toLowerCase()) ||
      item.status?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>
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
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
            Payments
          </Text>
        </View>

        {/* SEARCH BAR */}
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
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search by task or date"
              value={search}
              onChangeText={setSearch}
              style={{ marginLeft: 10, flex: 1 }}
            />
          </View>

          {/* PAYMENT LIST (ROWS) */}
          {filteredData.map((item) => {
            // ✅ STEP 3 PASTE HERE
            const totalDistance =
              item.deliveries?.reduce((sum, d) => sum + d.distance, 0) || 0;
            const amount = totalDistance * RATE_PER_KM;

            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedPayment({ ...item, amount, totalDistance });
                  setModalVisible(true);
                }}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 15,
                  marginTop: 15,
                  elevation: 3,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  ₹{amount} • Weekly Payout
                </Text>

                <Text style={{ color: "#6B7280", marginTop: 5 }}>
                  {item.date}
                </Text>

                <Text style={{ marginTop: 5 }}>{item.status}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* DETAILS MODAL */}
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
            {/* HEADER */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Payment Details
              </Text>

              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2933" />
              </Pressable>
            </View>

            {/* FULL DETAILS */}
            <Text style={{ marginTop: 10 }}>
              💰 Amount: ₹{selectedPayment?.amount}
            </Text>
            <Text>📅 Week Ending: {selectedPayment?.date}</Text>
            <Text>📦 Deliveries: {selectedPayment?.deliveries?.length}</Text>
            <Text>📍 Total Distance: {selectedPayment?.totalDistance} km</Text>
            <Text>💳 Method: {selectedPayment?.method}</Text>
            <Text>📌 Status: {selectedPayment?.status}</Text>

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Earnings Breakdown
            </Text>
            <Text>Rate: ₹{RATE_PER_KM}/km</Text>
            <Text>Total: ₹{selectedPayment?.amount}</Text>
            {/* CLOSE BUTTON */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 15,
                backgroundColor: "#2ECC71",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
