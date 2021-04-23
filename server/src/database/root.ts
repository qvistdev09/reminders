import { sequelize } from '../config/db-config';

// schemas
import { Project } from './schemas/project';
import { Permission } from './schemas/permission';
import { Task } from './schemas/task';

Project.hasMany(Permission, {
  foreignKey: {
    name: 'projectId',
    allowNull: false,
  },
});

Permission.belongsTo(Project, {
  foreignKey: {
    name: 'projectId',
    allowNull: false,
  },
});

Project.hasMany(Task, {
  foreignKey: {
    name: 'projectId',
    allowNull: false,
  },
});

Task.belongsTo(Project, {
  foreignKey: {
    name: 'projectId',
    allowNull: false,
  },
});

const authAndSyncDatabase = async () => {
  try {
    console.log('attempting to connect to DB');
    await sequelize.authenticate();
    console.log('Successfully connected to database');
    await sequelize.sync();
    console.log('Models synced');
  } catch (err) {
    console.log(err);
  }
};

export { Project, Permission, Task, authAndSyncDatabase };
