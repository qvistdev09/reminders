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

export { sequelize };
