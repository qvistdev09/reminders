import { UserInPermissionsGrid } from 'reminders-shared/sharedTypes';
import { useState } from 'react';
import { compareChanges, modifyOrAddPermission } from './use-manage-permissions-helpers';

const useManagePermissions = (currentPermissions: UserInPermissionsGrid[]) => {
  const [newPermissions, setNewPermissions] = useState([] as UserInPermissionsGrid[]);
  const newPermissionsPreview = compareChanges(currentPermissions, newPermissions);

  const addPermission = (newPermission: UserInPermissionsGrid) => {
    setNewPermissions(prevState => modifyOrAddPermission(prevState, newPermission));
  };

  const removeAllEdits = () => {
    setNewPermissions([]);
  };

  return {
    addPermission,
    removeAllEdits,
    newPermissionsPreview,
  };
};

export { useManagePermissions };
