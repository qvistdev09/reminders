import { PermissionOrder } from '../../../src/types/index';
import { useState } from 'react';
import { useAccessToken } from '../hooks/use-access-token';
import { postPermissionsOrderSet } from '../api-service/permissions';
import { UserInPermissionsGrid } from '../../../src/types/index';

const useManagePermissions = (
  projectId: number,
  callback: () => void,
  currentPermissions: UserInPermissionsGrid[],
  submitAll: boolean
) => {
  const accessToken = useAccessToken();
  const [newPermissions, setNewPermissions] = useState([] as UserInPermissionsGrid[]);

  const addPermission = (newPermission: UserInPermissionsGrid) => {
    setNewPermissions(prevState => {
      const match = prevState.find(prevUser => prevUser.uid === newPermission.uid);
      if (match) {
        return prevState.map(prev => {
          if (prev.uid === newPermission.uid) {
            return {
              ...prev,
              permissionRole: newPermission.permissionRole,
            };
          }
          return prev;
        });
      }
      return [...prevState, newPermission];
    });
  };

  const changedPermissions = currentPermissions.map(oldPermission => {
    const match = newPermissions.find(
      changedPermission => changedPermission.uid === oldPermission.uid
    );
    if (match) {
      return match;
    }
    return oldPermission;
  });

  const submitPermissionChanges = () => {
    if (accessToken) {
      const assignments: PermissionOrder[] = submitAll
        ? changedPermissions.map(user => ({
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
    changedPermissions,
  };
};

export { useManagePermissions };
