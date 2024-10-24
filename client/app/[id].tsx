import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { fetchTaskById } from "@/services/taskService";
import { taskSchema } from "@/components/task/TaskValidator";
import { Status, TaskProps } from "@/constants/Task";
import Toast from "react-native-toast-message";
import AntDesign from "@expo/vector-icons/AntDesign";
import DetailsRenderer from "@/components/details/DetailsRenderer";

//
//
//
// Task Details Page:
// -Fetching By ID
//
//
//

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState<TaskProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      let response;
      if (Array.isArray(id))
        response = await fetchTaskById(parseInt(id[0], 10));
      else response = await fetchTaskById(parseInt(id, 10));
      const newTask = await response.json();
      await taskSchema.validate(newTask);
      setDetails(newTask as TaskProps);
      setLoading(false);
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage =
          "Error fetching task: " + error.message + ". Please try again later.";
        console.error(errorMessage);
      } else {
        errorMessage = "An unexpected error occurred. Please try again later.";
      }
      Toast.show({
        text1: "Error",
        text2: errorMessage,
        type: "error",
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="rgb(102, 73, 100)" />;
  }
  if (details === null) return;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgb(234,231,222)",
        paddingHorizontal: 20,
        paddingTop: 10,
      }}
    >
      <Stack.Screen
        options={{
          title: "My Task",

          headerTitle: () => (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.headerText}
            >
              {details?.title}
            </Text>
          ),
        }}
      />

      <DetailsRenderer title="Full Title" body={details.title} />
      <DetailsRenderer title="Description" body={details.description} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Created At */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 10,
          }}
        >
          <AntDesign name="calendar" size={28} color="black" />
          <Text style={styles.textInfo}>
            {new Date(details.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Status */}
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          {details.status === Status.COMPLETED ? (
            <>
              <Text style={styles.textInfo}>Done</Text>
              <AntDesign name="checkcircleo" size={26} color="green" />
            </>
          ) : (
            <>
              <Text style={styles.textInfo}>Not Done</Text>
              <AntDesign name="closecircleo" size={26} color="red" />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    color: "white",
    width: "92%",
  },
  textInfo: {
    fontSize: 18,
    color: "rgb(102, 73, 100)",
    fontWeight: "bold",
  },
});
