export interface TaskActions {
  liveChange: (labelEdit: string) => void;
  updateLabel: (newLabel: string) => void;
  deleteTask: (taskId: number) => void;
  setStatus: (taskId: number, newStatus: boolean) => void;
}
