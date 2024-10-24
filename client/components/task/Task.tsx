import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { Status, TaskProps } from "@/constants/Task";
import { ListItem } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TaskComponentProsp {
  data: TaskProps;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  setModalData: (data: TaskProps) => void;
  setErrorMessage: (error: string | null) => void;
}

//
//
//
// Task List Component:
// -Gesture Handler (Swiping)
//
//
//

const Task = ({
  data,
  toggleTask,
  deleteTask,
  setModalData,
}: TaskComponentProsp) => {
  const [expanded, setExpanded] = useState(false);
  const [currentSlideValue, setCurrentSlideValue] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Gesture Handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      //   In case of glitching this can be deleted,
      onPanResponderMove(_, gestureState) {
        const newTranslateValue = gestureState.dx + currentSlideValue;

        if (newTranslateValue <= 100 && newTranslateValue >= -100) {
          translateX.setValue(newTranslateValue);
        }
      },

      onPanResponderRelease(_, gestureState) {
        const newTranslateValue = gestureState.dx + currentSlideValue;

        if (newTranslateValue < -100) {
          setCurrentSlideValue(-100);
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
        } else if (newTranslateValue > 100) {
          setCurrentSlideValue(100);
          Animated.spring(translateX, {
            toValue: 100,
            useNativeDriver: true,
          }).start();
        } else {
          setCurrentSlideValue(0);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  return (
    <View style={styles.mainContainer}>
      {/* Swipeable Component */}
      <Animated.View
        style={{ flex: 1, transform: [{ translateX: translateX }] }}
      >
        <View style={{}} {...panResponder.panHandlers}>
          {/* Collapsible List */}

          <ListItem.Accordion
            content={
              // Header

              <View style={styles.headerContainer}>
                {/* CheckBox */}

                <ListItem.CheckBox
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                  checkedColor="rgb(108,135,115)"
                  checked={data.status === Status.COMPLETED}
                  onPress={() => toggleTask(data.id)}
                />
                <ListItem.Content style={{ paddingLeft: 8 }}>
                  <ListItem.Title>
                    {/* Title */}

                    <Text
                      style={{
                        color:
                          data.status === Status.COMPLETED ? "grey" : "black",
                        textDecorationLine:
                          data.status === Status.COMPLETED
                            ? "line-through"
                            : "none",
                        textDecorationStyle: "solid",
                      }}
                    >
                      {data.title}
                    </Text>
                  </ListItem.Title>
                </ListItem.Content>
              </View>
            }
            isExpanded={expanded}
            onPress={() => {
              setExpanded(!expanded);
            }}
          >
            {/* Body */}
            <ListItem bottomDivider containerStyle={styles.bodyContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalData(data)}
                style={{
                  width: "100%",
                }}
              >
                {/* Description */}
                <ListItem.Content>
                  <ListItem.Title style={styles.descriptionContainer}>
                    <Text style={styles.description}>{data.description}</Text>
                  </ListItem.Title>

                  {/* Date */}
                  <ListItem.Subtitle>
                    <View>
                      <Text>
                        {new Date(data.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </ListItem.Subtitle>
                </ListItem.Content>
              </TouchableOpacity>
            </ListItem>
          </ListItem.Accordion>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTask(data.id)}
          >
            <Ionicons name="trash-outline" size={32} color="white" />
          </TouchableOpacity>

          {/* Info Button */}
          <Link
            href={{
              pathname: "/[id]",
              params: { id: data.id },
            }}
            style={{ position: "absolute", right: 0, bottom: 0 }}
            asChild
          >
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => {
                Animated.spring(translateX, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <MaterialIcons name="info-outline" size={32} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  mainContainer: { width: "100%", flexDirection: "row" },
  headerContainer: {
    width: "90%",
    flexDirection: "row",
    maxHeight: 40,
  },
  bodyContainer: {
    borderColor: "rgb(102, 73, 100)",
    borderBottomWidth: 2,
    paddingBottom: 5,
    paddingTop: 0,
  },
  infoButton: {
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: -100,
    width: 100,
    backgroundColor: "rgb(102, 73, 100)",
  },
  deleteButton: {
    backgroundColor: "red",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: -100,
    width: 100,
  },
  descriptionContainer: {
    alignSelf: "center",
    paddingBottom: 5,
    flex: 1,
  },
  description: { color: "rgb(40,40,40)", width: "100%" },
});
