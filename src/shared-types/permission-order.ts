import { UserObj, PermissionRole } from './index';

export interface PermissionOrder {
  userProfile: UserObj;
  userPermission: {
    projectId: number;
    permissionRole: PermissionRole;
  };
}
