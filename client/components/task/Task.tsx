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

interface TaskComponentProsp {
  data: TaskProps;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  setModalData: (data: TaskProps) => void;
}

const Task = ({
  data,
  toggleTask,
  deleteTask,
  setModalData,
}: TaskComponentProsp) => {
  const [expanded, setExpanded] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      //   In case of glitch this can be deleted,
      onPanResponderMove(_, gestureState) {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease(_, gestureState) {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: -0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  return (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <Animated.View
        style={{ flex: 1, transform: [{ translateX: translateX }] }}
      >
        <View style={{}} {...panResponder.panHandlers}>
          <ListItem.Accordion
            content={
              <View style={{ width: "90%", flexDirection: "row" }}>
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
            <ListItem
              bottomDivider
              containerStyle={{
                borderColor: "rgb(102, 73, 100)",
                borderBottomWidth: 2,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalData(data)}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    <Text style={{ flexShrink: 1 }}>
                      {data.description} AAAAAAAAAAAAAAAAAAAAAAAAAA
                      AAAAAAAAAAAAAAAAA AAAA AAAAA
                    </Text>
                  </ListItem.Title>
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
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              height: "100%",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              right: -100,
              width: 100,
            }}
            onPress={() => deleteTask(data.id)}
          >
            <Ionicons name="trash-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});
