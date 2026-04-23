import AsyncStorage from '@react-native-async-storage/async-storage';

// Defining a specific type for our keys makes the code safer
export const KEYS = {
  AVAILABLE: 'available_tasks',
  ACTIVE: 'active_task',
  USER: 'user',
  STATS: 'STATS',
  HISTORY: 'delivery_history' // 👈 Add this
};

/**
 * Saves data to AsyncStorage
 * @param key - Must be a string
 * @param value - Can be any serializable object or array
 */
export const saveData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving data", e);
  }
};

/**
 * Retrieves data from AsyncStorage
 * @param key - Must be a string
 */
export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error("Error reading data", e);
    return null; // Explicitly return null on error
  }
};

/**
 * Helper to get user stats
 */
export const getStats = async (): Promise<{ deliveries: number; meals: number; people: number }> => {
  const stats = await getData(KEYS.STATS);
  return stats || { deliveries: 0, meals: 0, people: 0 };
};


// ... keep your saveData and getData functions ...

/**
 * Removes a specific key from storage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data", e);
  }
};