import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {

      await AsyncStorage.clear(); // ✅ TEMPORARY RESET

      const role = await AsyncStorage.getItem("role");


      if (role === "donor") {
        router.replace("/donor/dashboard");
      } else if (role === "ngo") {
        router.replace("/ngo/dashboard");
      } else if (role === "volunteer") {
        router.replace("/volunteer");
      } else {
        router.replace("\home");
      }
    };

    checkRole();
  }, []);

  return <View />;

}