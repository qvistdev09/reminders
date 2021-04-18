import { PermissionOrder } from '../../../src/types/index';
import { useState } from 'react';
import { useAccessToken } from '../hooks/use-access-token';
import { postPermissionsOrderSet } from '../api-service/permissions';
import { UserInPermissionsGrid } from '../../../src/types/index';

const modifyOrAddPermission = (currentPermissions: UserInPermissionsGrid[], newPermission: UserInPermissionsGrid) => {
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

const compareChanges = (currentPermissions: UserInPermissionsGrid[], newPermissions: UserInPermissionsGrid[]) => {
  return currentPermissions.map(oldPermission => {
    const match = newPermissions.find(changedPermission => changedPermission.uid === oldPermission.uid);
    if (match) {
      return match;
    }
    return oldPermission;
  });
};

const useManagePermissions = (
  projectId: number,
  callback: () => void,
  currentPermissions: UserInPermissionsGrid[],
  submitAll: boolean
) => {
  const accessToken = useAccessToken();
  const [newPermissions, setNewPermissions] = useState([] as UserInPermissionsGrid[]);

  const addPermission = (newPermission: UserInPermissionsGrid) => {
    setNewPermissions(prevState => modifyOrAddPermission(prevState, newPermission));
  };

  const unsavedPermissionChanges = compareChanges(currentPermissions, newPermissions);

  const submitPermissionChanges = () => {
    if (accessToken) {
      const assignments: PermissionOrder[] = submitAll
        ? unsavedPermissionChanges.map(user => ({
            permissionUid: user.uid,
            permissionRole: user.permissionRole,
          }))
        : newPermissions.map(user => ({
            permissionUid: user.uid,
            permissionRole: user.permissionRole,
          }));
      const orderSet = {
        projectId,
        assignments,
      };
      postPermissionsOrderSet(orderSet, accessToken).then(() => {
        setNewPermissions([]);
        console.log('made it');
        callback();
      });
    }
  };

  return {
    addPermission,
    submitPermissionChanges,
    unsavedPermissionChanges,
  };
};

export { useManagePermissions };
