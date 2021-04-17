import { UserObj } from '../../../src/types/index';
import { PermissionOrder } from '../../../src/types/permission-order';
import { PermissionRole } from '../../../src/types/index';
import { useState } from 'react';
import { useAccessToken } from '../hooks/use-access-token';

const useManagePermissions = (projectId: number) => {
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

  return {
    addPermission,
  };
};

export { useManagePermissions };
