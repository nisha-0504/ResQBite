import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  AVAILABLE: "available_tasks",
  ACTIVE: "active_task",
  USER: "user",
  STATS: "stats",
  HISTORY: "delivery_history",
};

// OPTIONAL (only if you really use it)
export let currentUser = {
  name: "Raj",
};

export const setUserName = (name: string) => {
  currentUser.name = name;
};

// SAVE
export const saveData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving data", e);
  }
};

// GET
export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error("Error reading data", e);
    return null;
  }
};

// REMOVE
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data", e);
  }
};

// STATS
export const getStats = async (): Promise<{
  deliveries: number;
  meals: number;
  people: number;
}> => {
  const history = (await getData(KEYS.HISTORY)) ?? [];

  const deliveries = history.length;

  const meals = history.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  );

  const people = Math.floor(meals / 2);

  return { deliveries, meals, people };
};