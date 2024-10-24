import { StyleSheet, View } from "react-native";
import React, { createRef, useEffect } from "react";
import { HelperText, TextInput } from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
interface TaskInputProps {
  value: string;
  setValue: (val: string) => void;
  errorMessage?: string | null;
  height: number;
  label: string;
  autoFocus?: boolean;
}

//
//
//
// Custom input field
//
//
//

const TaskInput = ({
  value,
  setValue,
  errorMessage,
  height,
  label,
  autoFocus,
}: TaskInputProps) => {
  const ref = createRef<RNTextInput>();
  useEffect(() => {
    autoFocus &&
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 200);
  }, []);

  return (
    <View style={{ height }}>
      <TextInput
        ref={ref}
        label={label}
        value={value}
        onChangeText={(text) => setValue(text)}
        style={{ height: height - 5, backgroundColor: "transparent" }}
        activeUnderlineColor={
          errorMessage ? "rgb(215, 0, 64)" : "rgb(102, 73, 100)"
        }
      />
      <HelperText type="error" visible={errorMessage !== null}>
        {errorMessage}
      </HelperText>
    </View>
  );
};

export default TaskInput;

const styles = StyleSheet.create({});
