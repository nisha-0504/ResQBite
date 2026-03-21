import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to ResQBite 🍽️</Text>

      <Button title="Login" onPress={() => router.push("/login")} />
      <Button title="Signup" onPress={() => router.push("/signup")} />
      <Button title="Add Donation" onPress={() => router.push("/addDonation")} />
    </View>
  );
}