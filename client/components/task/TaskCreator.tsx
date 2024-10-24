import {
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  children?: ReactNode;
}

const TaskCreator = ({
  isVisible,
  data,
  children,
  setModalVisible,
  setModalData,
  handleNewTaskLocally,
  handleUpdateTaskLocally,
}: TaskCreatorProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
    }
  }, [isVisible]);

  const clearModal = (): void => {
    setTitle("");
    setDescription("");
    setErrorMessage(null);
  };
  const closeModal = (): void => {
    clearModal();
    setModalData(null);
    setModalVisible(false);
  };
  const handleSaveTask = async (): Promise<void> => {
    if (title === "") {
      setErrorMessage("Title cannot be empty");
      return;
    }

    setErrorMessage(null);
    let newTask: any = {};
    if (data) {
      try {
        newTask = await updateTaskDetails(data);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await addTask({
          title,
          description,
          status: Status.TO_DO,
        });
        newTask = await response.json();
        await taskSchema.validate(newTask);
      } catch (err) {
        console.error(err);
      }
    }

    if (data) {
      handleUpdateTaskLocally(newTask as TaskProps);
      closeModal();
      return;
    }
    handleNewTaskLocally(newTask as TaskProps);
    clearModal();
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
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
          onPress={() => closeModal()}
        />
        <View
          style={{
            width: "100%",
            backgroundColor: "rgb(244,241,238)",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: "hidden",
          }}
        >
          <View style={{ paddingBottom: 14 }}>
            <TaskInput
              autoFocus
              value={title}
              label="Title"
              setValue={setTitle}
              height={60}
              errorMessage={errorMessage}
            />
          </View>
          <TaskInput
            label="Description"
            value={description}
            setValue={setDescription}
            height={60}
          />
          <View
            style={{
              justifyContent: "flex-end",
              paddingTop: 5,
              paddingBottom: 15,
            }}
          >
            <Button
              mode="contained"
              buttonColor="rgb(108,135,115)"
              style={{ width: "60%", alignSelf: "center" }}
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
function updateTaskDetails(data: TaskProps): any {
  throw new Error("Function not implemented.");
}
