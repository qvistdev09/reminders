import { sequelize } from '../config/db-config';
import { Project } from './schemas/project';

const authAndSyncDatabase = async () => {
  try {
    console.log('attempting to connect to DB');
    await sequelize.authenticate();
    console.log('Successfully connected to database');
    await Project.sync({ force: true });
    console.log('Models synced');
  } catch (err) {
    console.log(err.message);
  }
};

export { authAndSyncDatabase };
