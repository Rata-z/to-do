import { StyleSheet, Text, View } from "react-native";
import React from "react";
interface detailsProps {
  title: string;
  body: string | undefined;
}

//
//
// Task Details Component
//
//
export default function DetailsRenderer({ title, body }: detailsProps) {
  if (!body) {
    return;
  }
  return (
    <View style={styles.mainContainer}>
      <Text style={{ color: "#690162", fontSize: 20 }}>{title}</Text>
      <View style={styles.bodyContainer}>
        <Text style={{ fontSize: 16 }}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "transparent",
    gap: 5,
    paddingVertical: 10,
  },
  bodyContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
