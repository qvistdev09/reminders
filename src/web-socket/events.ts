import { SocketEvent } from '../types/index';

const e: Record<SocketEvent, SocketEvent> = {
  newUserList: 'newUserList',
  identity: 'identity',
  taskList: 'taskList',
  authResponse: 'authResponse',
};

export { e };