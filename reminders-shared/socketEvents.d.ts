interface Events {
  newUserList: 'newUserList';
  identity: 'identity';
  taskList: 'taskList';
  authResponse: 'authResponse';
  liveChange: 'liveChange';
  deleteTask: 'deleteTask';
  submitNewTask: 'submitNewTask';
  disconnect: 'disconnect';
  connection: 'connection';
  taskEditStart: 'taskEditStart';
  taskEditStop: 'taskEditStop';
  stopUserEdit: 'stopUserEdit';
}

export const s: Events;
