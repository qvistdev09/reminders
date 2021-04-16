import { sequelize } from 'src/config/db-config';

// schemas
import { Project } from 'src/database/schemas/project';
import { Permission } from 'src/database/schemas/permission';

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

const authAndSyncDatabase = async () => {
  try {
    console.log('attempting to connect to DB');
    await sequelize.authenticate();
    console.log('Successfully connected to database');
    await Project.sync({ force: true });
    await Permission.sync({ force: true });
    console.log('Models synced');
  } catch (err) {
    console.log(err.message);
  }
};

export { Project, Permission, authAndSyncDatabase };
