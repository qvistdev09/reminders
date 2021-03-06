export type PermissionRole = 'viewer' | 'editor';

export interface UserObj {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}

export type Ownership = 'mine' | 'others';

export interface UserInPermissionsGrid extends UserObj {
  permissionRole: PermissionRole;
}

export interface PermissionOrder {
  permissionUid: string;
  permissionRole: PermissionRole;
}

export interface PermissionOrderSet {
  projectId: number;
  assignments: PermissionOrder[];
}

export interface ProjectObject {
  projectTitle: string;
  projectId: number;
  permissions: UserInPermissionsGrid[];
  projectVisibility: ProjectVisibility;
  projectOwner: UserObj;
}

export type ProjectVisibility = 'authorizedOnly' | 'public' | 'private';

export interface NewProjectFields {
  projectTitle: string;
  projectVisibility: ProjectVisibility;
}

export interface ProjectAccessResponse {
  role: PermissionRole | 'owner' | 'none';
  projectVisibility: ProjectVisibility;
  tasks?: TaskLiveModel[] | null;
  owner?: UserObj | null;
  title?: string | null;
}

export interface SocketStatus {
  authenticated: boolean;
  role: PermissionRole | 'Owner' | null;
  uid: string | null;
}

export interface TaskLiveModel {
  taskLabel: string;
  taskFinished: boolean;
  taskId: number;
  inEditBy: string[];
}

export interface LiveUserPublicIdentity {
  fullName: string;
  role: PermissionRole | 'Owner';
  color: string;
  uid: string;
}

// sockets packets

export interface PktTaskLabel {
  taskLabel: string;
}

export interface PktTaskIdentifier {
  taskId: number;
}

export interface PktLiveChange extends PktTaskLabel, PktTaskIdentifier {}

export interface PktTaskStatus extends PktTaskIdentifier {
  taskFinished: boolean;
}
