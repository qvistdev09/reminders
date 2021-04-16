import { Model, Optional } from 'sequelize';
import { sequelize } from 'src/config/db-config';
import { DataTypes } from 'sequelize';

interface ProjectAttributes {
  projectId?: number;
  projectTitle: string;
  projectOwner: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'projectId'> {}

export interface ProjectInstance
  extends Model<ProjectAttributes, ProjectCreationAttributes>,
    ProjectAttributes {
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
});

export { Project };
