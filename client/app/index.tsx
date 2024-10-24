import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { Status, TaskProps } from "@/constants/Task";
import Task from "@/components/task/Task";
import { FlashList } from "@shopify/flash-list";
import { deleteTask, fetchTasks, updateTask } from "@/services/taskService";
import {
  fetchTasksFromDevice,
  storeTasksOnDevice,
} from "@/services/asyncStorageService";
import { Link, Stack } from "expo-router";
import TaskCreator from "@/components/task/TaskCreator";
import ListHeader from "@/components/ListHeader";
import { taskSchema } from "@/components/task/TaskValidator";
import Toast from "react-native-toast-message";

//
//
//
// Home Screen:
// -Local Fetch (AsyncStorage)
// -Database Fetch
// -Local Create/Update
// -Re-Fetch on swipe
// -CheckBox Toggler
// -Database Update/Delete
//
//
//

const Home = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<TaskProps | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (modalData) setModalVisible(true);
  }, [modalData]);

  // Error Alert
  useEffect(() => {
    if (errorMessage)
      Toast.show({
        text1: "Error",
        text2: errorMessage,
        type: "error",
      });
  }, [errorMessage]);

  // get call to asyncStorageService
  const loadTasks = async () => {
    try {
      const storedTasks = await fetchTasksFromDevice();
      if (storedTasks === null || storedTasks.length === 0) {
        fetchTasksFromDatabase();
        return;
      }
      setTasks(storedTasks);
      setLoading(false);
      return;
    } catch (error) {
      errorHandler("Error loading tasks: ", error);
    }
    fetchTasksFromDatabase();
    return;
  };

  // Get call to taskService
  const fetchTasksFromDatabase = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.sort((a, b) => b.id - a.id));
      storeTasksOnDevice(response);
    } catch (error) {
      errorHandler("Error fetching tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTaskLocally = (task: TaskProps) => {
    const newList = [...tasks, task];
    setTasks(newList);
    storeTasksOnDevice(newList);
  };
  const handleUpdateTaskLocally = (task: TaskProps) => {
    const newList = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(newList);
    storeTasksOnDevice(newList);
  };

  // Error message builder
  const errorHandler = (task: string, error: any): void => {
    if (error instanceof Error) {
      setErrorMessage(task + error.message + ". Please try again later.");
    } else {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  // Re-Fetch from Database on swipe down
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTasksFromDatabase();
    } catch (error) {
      errorHandler("Error fetching tasks: ", error);
    }
    setRefreshing(false);
  };

  // CheckBox toggler
  const toggleTaskCompletion = (taskId: number) => {
    const toggledTask = tasks.find((t) => t.id === taskId);
    if (toggledTask) {
      toggledTask.status =
        toggledTask.status === Status.COMPLETED
          ? Status.TO_DO
          : Status.COMPLETED;
      updateTaskDetails(toggledTask);

      const newList = tasks.map((t) => (t.id === taskId ? toggledTask : t));
      setTasks(newList);
      storeTasksOnDevice(newList);
    } else {
      setErrorMessage("Error: Task not found.");
    }
  };

  // Update call to taskService
  const updateTaskDetails = async (
    task: TaskProps
  ): Promise<TaskProps | null> => {
    try {
      const response = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: task.status,
      });
      const newTask = await response.json();
      await taskSchema.validate(newTask);
      return newTask as TaskProps;
    } catch (error) {
      errorHandler("Error updating tasks: ", error);
    }
    return null;
  };
  // Delete call to taskService
  const handleDeleteTask = (taskId: number) => {
    setTasks((prevtasks) => prevtasks.filter((t) => t.id !== taskId));
    deleteTask(taskId);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="rgb(102, 73, 100)" />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "My home",
          headerTitle: () => <ListHeader />,
        }}
      />
      {/* List */}
      <FlashList
        data={tasks}
        ListEmptyComponent={
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>Add some tasks!</Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <Task
              key={item.id}
              data={item}
              deleteTask={handleDeleteTask}
              toggleTask={toggleTaskCompletion}
              setModalData={setModalData}
              setErrorMessage={setErrorMessage}
            ></Task>
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      {/* Add Button */}
      {!isVisible && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="plus" size={44} color="white" />
        </TouchableOpacity>
      )}
      {/* Task Editor Modal */}
      <TaskCreator
        handleNewTaskLocally={handleNewTaskLocally}
        handleUpdateTaskLocally={handleUpdateTaskLocally}
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        setModalData={setModalData}
        updateTaskDetails={updateTaskDetails}
        data={modalData}
        setErrorMessage={setErrorMessage}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyMessageContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyMessageText: { fontSize: 24, color: "grey" },
  addButton: {
    position: "absolute",
    bottom: 35,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(108,135,115)",
    right: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});
