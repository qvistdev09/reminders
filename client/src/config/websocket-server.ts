const nodeEnv = process.env.NODE_ENV;

interface Paths {
  dev: 'http://localhost:3000';
  prod: 'https://qvistdev-reminders.herokuapp.com';
}

const paths: Paths = {
  dev: 'http://localhost:3000',
  prod: 'https://qvistdev-reminders.herokuapp.com',
};

const server = nodeEnv === 'production' ? paths.prod : paths.dev;

export { server };
