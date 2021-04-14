const apiUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api'
    : 'https://qvistdev-reminders.herokuapp.com/api';

export { apiUrl };
