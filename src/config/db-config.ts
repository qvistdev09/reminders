import { Sequelize } from 'sequelize';

const dbUrl = process.env.DATABASE_URL as string;

if (!dbUrl) {
  throw new Error('Missing database url in environment variables');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const authenticateDb = async () => {
  try {
    console.log('attempting to connect to DB')
    await sequelize.authenticate();
    console.log('Successfully connected to database');
  } catch (error) {
    console.log(error.message);
  }
};

export { sequelize, authenticateDb };
