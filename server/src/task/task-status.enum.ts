export enum TaskStatus {
  TO_DO = 'TO_DO',
  COMPLETED = 'COMPLETED',
}

export function isValidTaskStatus(status: any): status is TaskStatus {
  return Object.values(TaskStatus).includes(status);
}
