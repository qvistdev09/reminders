import { PermissionOrder, PermissionRole } from '../../../src/types/index';
import { useState } from 'react';
import { useAccessToken } from '../hooks/use-access-token';
import { postPermissionsOrderSet } from '../api-service/permissions';

const useManagePermissions = (projectId: number, callback: () => void) => {
  const accessToken = useAccessToken();
  const [newPermissions, setNewPermissions] = useState([] as PermissionOrder[]);

  const addPermission = (permissionUid: string, permissionRole: PermissionRole) => {
    setNewPermissions(prevState => [
      ...prevState,
      {
        permissionUid,
        projectId,
        permissionRole,
      },
    ]);
  };

  const submitPermissionChanges = () => {
    if (newPermissions.length > 0 && accessToken) {
      const orderSet = {
        projectId,
        assignments: newPermissions,
      };
      postPermissionsOrderSet(orderSet, accessToken).then(() => {
        setNewPermissions([]);
        callback();
      });
    }
  };

  return {
    addPermission,
    submitPermissionChanges,
  };
};

export { useManagePermissions };
