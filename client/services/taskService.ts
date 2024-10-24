import { NewTaskProps, Status, TaskProps } from "@/constants/Task";

//
//
//
// Database API Call Service:
// -FetchAll
// -FetchByStatus
// -FetchById
// -Create
// -Update
// -Delete
//
//
//

const API_URL = "http://10.0.2.2:3000/tasks";

export const fetchTasks = async (): Promise<TaskProps[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Response error: ${response.status}`);

  const data: TaskProps[] = await response.json();
  return data;
};

export const fetchTasksByStatus = async (
  status: Status
): Promise<TaskProps[]> => {
  const response = await fetch(`${API_URL}?status=${status}`);
  if (!response.ok) throw new Error(`Response error: ${response.status}`);

  const data: TaskProps[] = await response.json();
  return data;
};

export const fetchTaskById = async (taskId: number): Promise<Response> => {
  const response = await fetch(`${API_URL}/${taskId}`);
  if (!response.ok) throw new Error(`Response error: ${response.status}`);

  return response;
};

export const addTask = async (newTask: NewTaskProps): Promise<Response> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return response;
};

export const updateTask = async (
  taskId: number,
  updatedTask: { title: string; description: string; status: Status }
): Promise<Response> => {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });
  return response;
};

export const deleteTask = async (taskId: number): Promise<Response> => {
  const response = fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  return response;
};
