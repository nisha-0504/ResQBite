import AsyncStorage from "@react-native-async-storage/async-storage";

// KEYS
export const KEYS = {
  AVAILABLE: "availableTasks",
  ACTIVE: "activeTask",
  HISTORY: "historyTasks"
};

// utils/userStore.ts
export let currentUser = {
  name: "Raj",
};

export const setUserName = (name: string) => {
  currentUser.name = name;
};
// SAVE
export const saveData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

// GET
export const getData = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// REMOVE
export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const getStats = async () => {
  const history = (await getData(KEYS.HISTORY)) ?? [];

  const deliveries = history.length;

  const meals = history.reduce((sum: number, item: any) => {
    return sum + (item.quantity || 0);
  }, 0);

  const people = meals; // simple assumption

  return { deliveries, meals, people };
};