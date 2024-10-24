import { Status } from "@/constants/Task";
import { object, string, number, InferType, mixed } from "yup";

export const taskSchema = object({
  id: number().required().positive().integer(),
  title: string().required(),
  description: string(),
  status: mixed<Status>().oneOf(Object.values(Status)).required(),
  created_at: string().required(),
});

type Task = InferType<typeof taskSchema>;
