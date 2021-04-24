import { Transaction } from 'sequelize/types';
import { Task } from '../../database/root';

export const destroyTasksByProjectId = (projectId: number, transaction: Transaction) => {
  return Task.destroy({ where: { projectId }, transaction });
};
