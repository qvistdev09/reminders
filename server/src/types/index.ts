import { Socket } from 'socket.io';
import { PermissionRole, UserObj, NewProjectFields, TaskLiveModel } from 'reminders-shared/sharedTypes';

export interface AuthedSocketObj extends UserObj {
  permissionRole: PermissionRole | 'Owner';
  socket: Socket;
  projectId: number;
}

export interface LiveUser extends AuthedSocketObj {
  color: string;
}

export interface NewProject extends NewProjectFields {
  projectOwner: string;
}

export interface Session {
  users: LiveUser[];
  projectId: number;
  tasks: TaskLiveModel[];
}
