import { useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { projectsApi } from '../api-service/projects';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { getProjects, projectsReducer } from '../reducers/slices/projects';
import {
  PermissionOrder,
  PermissionOrderSet,
  ProjectVisibility,
  UserInPermissionsGrid,
} from 'reminders-shared/sharedTypes';
import { permissionsApi } from '../api-service/permissions';

const useProjects = () => {
  const accessToken = useAccessToken();
  const dispatch = useAppDispatch();
  const { projects, retrieved } = useAppSelector(getProjects);

  const syncProjectsWithServer = () => {
    if (accessToken) {
      projectsApi
        .getAll(accessToken, 'mine')
        .then(({ data: { projects } }) => dispatch(projectsReducer.setAll(projects)));
    }
  };

  const submitProject = (projectTitle: string) => {
    if (accessToken) {
      projectsApi
        .create(
          {
            projectTitle,
            projectVisibility: 'authorizedOnly',
          },
          accessToken
        )
        .then(() => syncProjectsWithServer());
    }
  };

  const addPermissions = (projectId: number, newPermissions: UserInPermissionsGrid[]) => {
    if (accessToken) {
      dispatch(projectsReducer.addPermissions({ projectId, newPermissions }));
      const assignments: PermissionOrder[] = newPermissions.map(permission => ({
        permissionUid: permission.uid,
        permissionRole: permission.permissionRole,
      }));
      const orderSet = {
        projectId,
        assignments,
      };
      permissionsApi.postOrderSet(orderSet, accessToken).catch(() => syncProjectsWithServer());
    }
  };

  const editSeveralPermissions = (projectId: number, changedPermissions: PermissionOrder[]) => {
    dispatch(projectsReducer.editSeveralPermissions({ projectId, changedPermissions }));
  };

  const editPermission = (projectId: number, permission: PermissionOrder) => {
    if (accessToken) {
      dispatch(
        projectsReducer.editPermission({
          projectId,
          uid: permission.permissionUid,
          newRole: permission.permissionRole,
        })
      );
      const orderSet: PermissionOrderSet = {
        projectId,
        assignments: [permission],
      };
      permissionsApi.postOrderSet(orderSet, accessToken).catch(() => syncProjectsWithServer());
    }
  };

  const deleteProject = (projectId: number) => {
    if (accessToken) {
      dispatch(projectsReducer.delete({ projectId }));
      projectsApi.delete(projectId.toString(), accessToken).catch(() => syncProjectsWithServer());
    }
  };

  const changeVisibility = (projectId: number, newSetting: ProjectVisibility) => {
    if (accessToken) {
      dispatch(projectsReducer.changeVisibility({ projectId, newSetting }));
      projectsApi
        .changeVisibility(projectId.toString(), newSetting, accessToken)
        .catch(() => syncProjectsWithServer());
    }
  };

  useEffect(() => {
    if (accessToken && !retrieved) {
      projectsApi
        .getAll(accessToken, 'mine')
        .then(({ data: { projects } }) => dispatch(projectsReducer.setAll(projects)));
    }
  }, [accessToken, dispatch, retrieved]);
  return {
    projects,
    submitProject,
    addPermissions,
    editSeveralPermissions,
    editPermission,
    deleteProject,
    changeVisibility,
  };
};

export { useProjects };
