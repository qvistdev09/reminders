import { Socket } from 'socket.io';

export type PermissionRole = 'viewer' | 'editor';

export interface UserObj {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}

export interface UserInPermissionsGrid {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  permissionRole: PermissionRole | 'Owner';
}

export interface PermissionOrder {
  permissionUid: string;
  permissionRole: PermissionRole | 'Owner';
}

export interface PermissionOrderSet {
  projectId: number;
  assignments: PermissionOrder[];
}

export interface ProjectObject {
  projectTitle: string;
  projectId: number;
  permissions: UserInPermissionsGrid[];
}

export interface AuthedSocketObj extends UserObj {
  permissionRole: PermissionRole | 'Owner';
  socket: Socket;
  projectId: number;
}

export interface LiveUser extends AuthedSocketObj {
  color: string;
}

export type ProjectVisibility = 'authorizedOnly' | 'public' | 'private';

export interface NewProjectFields {
  projectTitle: string;
  projectVisibility: ProjectVisibility;
}

export interface NewProject extends NewProjectFields {
  projectOwner: string;
}

export interface ProjectAccessResponse {
  role: PermissionRole | 'Owner' | 'none';
  visibility: ProjectVisibility;
}

export interface SocketStatus {
  authenticated: boolean;
  role: PermissionRole | 'Owner' | null;
}

export type SocketEvent = 'newUserList' | 'identity' | 'taskList' | 'authResponse';

export interface TaskLiveModel {
  label: string;
  finished: boolean;
}

export interface Session {
  users: LiveUser[];
  projectId: number;
  tasks: TaskLiveModel[];
}

export interface LiveUserPublicIdentity {
  fullName: string;
  role: PermissionRole | 'Owner';
  color: string;
}
