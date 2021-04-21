import { Socket } from 'socket.io';
import { PermissionRole, UserObj, NewProjectFields, TaskLiveModel } from 'reminders-shared/sharedTypes';

// Live edit

export interface AuthorizedEntry {
  userObj: UserObj;
  socket: Socket;
  projectId: number;
  permissionRole: PermissionRole | 'Owner';
}

export interface Connection {
  socket: Socket;
  permissionRole: PermissionRole | 'Owner';
  projectId: number;
}

export interface LiveUser {
  userObj: UserObj;
  color: string;
  connections: Connection[];
}

// Projects route

export interface NewProject extends NewProjectFields {
  projectOwner: string;
}


