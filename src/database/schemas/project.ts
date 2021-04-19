import { Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db-config';
import { DataTypes } from 'sequelize';
import { ProjectVisibility } from '../../types/index';

interface ProjectAttributes {
  projectId?: number;
  projectTitle: string;
  projectOwner: string;
  projectVisibility: ProjectVisibility;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'projectId'> {}

export interface ProjectInstance extends Model<ProjectAttributes, ProjectCreationAttributes>, ProjectAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Project = sequelize.define<ProjectInstance>('Project', {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  projectTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectOwner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectVisibility: {
    type: DataTypes.ENUM('authorizedOnly', 'public', 'private'),
    allowNull: false,
  },
});

export { Project };
