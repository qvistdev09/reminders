export type PermissionRole = 'viewer' | 'editor' | 'delete';

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
}
