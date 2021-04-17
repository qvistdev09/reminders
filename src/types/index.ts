export type PermissionRole = 'viewer' | 'editor' | 'delete';

export interface UserObj {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}

export interface PermissionOrder {
  permissionUid: string;
  permissionRole: PermissionRole;
}

export interface PermissionOrderSet {
  projectId: number;
  assignments: PermissionOrder[];
}
