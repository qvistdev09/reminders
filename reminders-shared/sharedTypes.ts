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

export type ProjectVisibility = 'authorizedOnly' | 'public' | 'private';

export interface NewProjectFields {
  projectTitle: string;
  projectVisibility: ProjectVisibility;
}

export interface ProjectAccessResponse {
  role: PermissionRole | 'Owner' | 'none';
  visibility: ProjectVisibility;
}

export interface SocketStatus {
  authenticated: boolean;
  role: PermissionRole | 'Owner' | null;
}

export interface TaskLiveModel {
  taskLabel: string;
  taskFinished: boolean;
  taskId: number;
}

export interface LiveUserPublicIdentity {
  fullName: string;
  role: PermissionRole | 'Owner';
  color: string;
  uid: string;
}