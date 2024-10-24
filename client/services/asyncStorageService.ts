import { TaskProps } from "@/constants/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";

//
//
//
// Local Storage Service:
// -Store
// -Fetch
// -Delete
//
//
//
//

const STORAGE_KEY = "@local_tasks";

export const storeTasksOnDevice = async (value: TaskProps[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error storing data on device:", error);
  }
};

export const fetchTasksFromDevice = async (): Promise<TaskProps[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error fetching data from device:", error);
    return null;
  }
};

export const removeTasksFromDevice = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error removing data from device:", error);
  }
};
