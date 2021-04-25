import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { Transaction } from 'sequelize/types';
import { Task } from '../../database/root';

export const destroyTasksByProjectId = (projectId: number, transaction: Transaction) => {
  return Task.destroy({ where: { projectId }, transaction });
};

export const getTasksByProjectId = async (projectId: number): Promise<TaskLiveModel[]> => {
  try {
    const tasks = await Task.findAll({ where: { projectId } });
    const restructuredTasks: TaskLiveModel[] = tasks.map(task => ({
      taskLabel: task.taskLabel,
      taskFinished: task.taskFinished,
      taskId: task.taskId as number,
      inEditBy: [],
    }));
    return restructuredTasks;
  } catch (err) {
    throw err;
  }
};
