const apiUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://qvistdev-reminders.herokuapp.com/api';

export { apiUrl };
