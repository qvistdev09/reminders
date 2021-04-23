import { UserInPermissionsGrid } from 'reminders-shared/sharedTypes';

export const compareChanges = (
  currentPermissions: UserInPermissionsGrid[],
  newPermissions: UserInPermissionsGrid[]
) => {
  return currentPermissions.map(oldPermission => {
    const match = newPermissions.find(changedPermission => changedPermission.uid === oldPermission.uid);
    if (match) {
      return match;
    }
    return oldPermission;
  });
};

export const modifyOrAddPermission = (
  currentPermissions: UserInPermissionsGrid[],
  newPermission: UserInPermissionsGrid
) => {
  const match = currentPermissions.find(prev => prev.uid === newPermission.uid);
  if (match) {
    return currentPermissions.map(prev => {
      if (prev.uid === newPermission.uid) {
        return {
          ...prev,
          permissionRole: newPermission.permissionRole,
        };
      }
      return prev;
    });
  }
  return [...currentPermissions, newPermission];
};
