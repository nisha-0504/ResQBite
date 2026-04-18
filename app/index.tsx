import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {

      await AsyncStorage.clear(); // (remove later if not needed)

      const role = await AsyncStorage.getItem("role");


      if (role === "donor") {
        router.replace("/donor/dashboard");
      } else if (role === "ngo") {
        router.replace("/ngo/dashboard");
      } else if (role === "volunteer") {
        router.replace("/(volunteer)/(tabs)/home");
      } else {
        router.replace("/role");
      }
    };

    checkRole();
  }, []);

  return <View />;
}