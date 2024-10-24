export enum Status {
  TO_DO = "TO_DO",
  COMPLETED = "COMPLETED",
}

export type TaskProps = {
  id: number;
  title: string;
  description: string;
  status: Status;
  created_at: string;
};

export type NewTaskProps = {
  title: string;
  description: string;
  status: Status;
};
