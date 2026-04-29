// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://YOUR_IP:5000/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = global.token; // or AsyncStorage later
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;