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
}

export type ProjectVisibility = 'authorizedOnly' | 'public' | 'private';

export interface NewProjectFields {
  projectTitle: string;
  projectVisibility: ProjectVisibility;
}

export interface NewProject extends NewProjectFields {
  projectOwner: string;
}
