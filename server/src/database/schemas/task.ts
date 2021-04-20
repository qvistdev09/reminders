import { Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db-config';
import { DataTypes } from 'sequelize';

interface TaskAttributes {
  taskId?: number;
  projectId?: number;
  taskLabel: string;
  taskFinished: boolean;
}

interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'taskId'>,
    Optional<TaskAttributes, 'projectId'> {}

export interface TaskInstance extends Model<TaskAttributes, TaskCreationAttributes>, TaskAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Task = sequelize.define<TaskInstance>('Task', {
  taskId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  taskLabel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taskFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export { Task };
