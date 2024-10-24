import { Status } from "@/constants/Task";
import { object, string, number, date, InferType, mixed } from "yup";

export const taskSchema = object({
  id: number().required().positive().integer(),
  title: string().required(),
  description: string().required(),
  status: mixed<Status>().oneOf(Object.values(Status)).required(),
  created_at: string().required(),
});

type Task = InferType<typeof taskSchema>;
