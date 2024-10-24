import {
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { Status, TaskProps } from "@/constants/Task";
import { addTask, updateTask } from "@/services/taskService";
import { Button } from "react-native-paper";
import TaskInput from "./TaskInput";
import { taskSchema } from "./TaskValidator";

interface TaskCreatorProps {
  isVisible: boolean;
  data: TaskProps | null;
  setModalVisible: (state: boolean) => void;
  setModalData: (data: TaskProps | null) => void;
  handleUpdateTaskLocally: (task: TaskProps) => void;
  handleNewTaskLocally: (task: TaskProps) => void;
  updateTaskDetails: (task: TaskProps) => Promise<TaskProps | null>;
  setErrorMessage: (error: string | null) => void;
  children?: ReactNode;
}

//
//
//
//
// Task Creator Modal:
// -Clear Forms
// -Close Modal
// -Save Task
//
//
//
//
//
//
//

const TaskCreator = ({
  isVisible,
  data,
  children,
  setModalVisible,
  setModalData,
  handleNewTaskLocally,
  handleUpdateTaskLocally,
  setErrorMessage,
}: TaskCreatorProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isVisible && data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
    }
  }, [isVisible]);

  const clearForms = (): void => {
    setTitle("");
    setDescription("");
    setInputErrorMessage(null);
  };
  const closeModal = (): void => {
    clearForms();
    setModalData(null);
    setModalVisible(false);
  };
  const handleSaveTask = async (): Promise<void> => {
    // Title validation
    if (title === "") {
      setInputErrorMessage("Title cannot be empty");
      return;
    }

    setInputErrorMessage(null);
    let newTask: any = {};
    if (data) {
      // Updating Task
      try {
        newTask = await handleUpdateTaskLocally(data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(
            "Error updating tasks: " +
              error.message +
              " Please try again later."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
        return;
      }
    } else {
      // Creating New Task
      try {
        const response = await addTask({
          title,
          description,
          status: Status.TO_DO,
        });
        newTask = await response.json();
        await taskSchema.validate(newTask);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(
            "Error creating tasks: " +
              error.message +
              " Please try again later."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
        return;
      }
    }

    // Saving locally
    if (data) {
      handleUpdateTaskLocally(newTask as TaskProps);
      closeModal();
      return;
    }
    handleNewTaskLocally(newTask as TaskProps);
    clearForms();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={isVisible}
      onRequestClose={() => closeModal()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <Pressable style={styles.background} onPress={() => closeModal()} />
        <View style={styles.modalContainer}>
          <View style={{ paddingBottom: 14 }}>
            <TaskInput
              autoFocus
              value={title}
              label="Title"
              setValue={setTitle}
              height={60}
              errorMessage={inputErrorMessage}
            />
          </View>
          <TaskInput
            label="Description"
            value={description}
            setValue={setDescription}
            height={60}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              buttonColor="rgb(108,135,115)"
              style={styles.button}
              onPress={() => handleSaveTask()}
            >
              Save
            </Button>
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TaskCreator;

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  background: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "rgb(244,241,238)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    justifyContent: "flex-end",
    paddingTop: 5,
    paddingBottom: 15,
  },
  button: { width: "60%", alignSelf: "center" },
});
