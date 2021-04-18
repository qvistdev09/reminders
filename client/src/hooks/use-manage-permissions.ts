import { PermissionOrder } from '../../../src/types/index';
import { useState } from 'react';
import { useAccessToken } from '../hooks/use-access-token';
import { postPermissionsOrderSet } from '../api-service/permissions';
import { UserInPermissionsGrid } from '../../../src/types/index';
import { useProjects } from './use-projects';

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
  currentPermissions: UserInPermissionsGrid[],
  submitAll: boolean,
  directEdits: boolean
) => {
  const { changePermissionsLocally, syncProjectsWithServer } = useProjects();
  const accessToken = useAccessToken();
  const [newPermissions, setNewPermissions] = useState([] as UserInPermissionsGrid[]);

  const unsavedChanges = newPermissions.length > 0;
  const newPermissionsPreview = compareChanges(currentPermissions, newPermissions);

  const submitDirectEdit = (edit: UserInPermissionsGrid) => {
    if (accessToken) {
      changePermissionsLocally(projectId, [edit]);
      setNewPermissions([]);
      const assignments = [{ permissionUid: edit.uid, permissionRole: edit.permissionRole }];
      postPermissionsOrderSet(
        {
          projectId,
          assignments,
        },
        accessToken
      ).catch(() => {
        console.log('Direct edit could not be made, resyncing with server');
        syncProjectsWithServer();
      });
    }
  };

  const addPermission = (newPermission: UserInPermissionsGrid) => {
    if (directEdits) {
      return submitDirectEdit(newPermission);
    }
    setNewPermissions(prevState => modifyOrAddPermission(prevState, newPermission));
  };

  const removeAllEdits = () => {
    setNewPermissions([]);
  };

  const submitPermissionChanges = () => {
    if (accessToken) {
      const changesToSubmit = submitAll ? newPermissionsPreview : newPermissions;
      changePermissionsLocally(projectId, changesToSubmit);
      setNewPermissions([]);
      const assignments: PermissionOrder[] = changesToSubmit.map(change => ({
        permissionUid: change.uid,
        permissionRole: change.permissionRole,
      }));
      const orderSet = {
        projectId,
        assignments,
      };
      postPermissionsOrderSet(orderSet, accessToken).catch(() => {
        console.log('The request to change permissions could not be made, resyncing with server');
        syncProjectsWithServer();
      });
    }
  };

  return {
    addPermission,
    submitPermissionChanges,
    newPermissionsPreview,
    removeAllEdits,
    unsavedChanges,
  };
};

export { useManagePermissions };
