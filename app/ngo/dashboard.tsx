import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function NgoDashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>NGO Dashboard</Text>

      <Button
        title="Track Delivery"
        onPress={() => router.push("/ngo/trackingScreen")}
      />
    </View>
  );
}