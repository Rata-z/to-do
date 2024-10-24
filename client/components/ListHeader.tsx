import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";

const ListHeader = () => {
  const [title, setTitle] = useState("TO-DO");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      {isEditing ? (
        <TextInput
          style={styles.text}
          value={title}
          onChangeText={setTitle}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <Pressable onPress={() => setIsEditing(true)}>
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ListHeader;
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
