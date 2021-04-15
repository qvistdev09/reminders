import { sequelize } from '../../config/db-config';
import { DataTypes } from 'sequelize';

const Project = sequelize.define('Project', {
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
