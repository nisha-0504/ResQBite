import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api`,
});

// 🔥 Attach token automatically
API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  console.log("SENDING TOKEN:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req; 
});

export default API;