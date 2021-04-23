import { useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { projectsApi } from '../api-service/projects';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { getProjects, setProjects, updateOrAddPermissions, localDelete } from '../reducers/slices/projects';
import { UserInPermissionsGrid } from 'reminders-shared/sharedTypes';

const useProjects = () => {
  const accessToken = useAccessToken();
  const dispatch = useAppDispatch();
  const { projects, retrieved, locallyChangedProjects } = useAppSelector(getProjects);

  const syncProjectsWithServer = () => {
    if (accessToken) {
      projectsApi
        .getAll(accessToken, 'others')
        .then(({ data: { projects } }) => dispatch(setProjects(projects)));
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

  const changePermissionsLocally = (projectId: number, permissionChanges: UserInPermissionsGrid[]) => {
    dispatch(
      updateOrAddPermissions({
        projectId,
        permissionChanges,
      })
    );
  };

  const deleteProject = (projectId: number) => {
    if (accessToken) {
      dispatch(localDelete({ projectId }));
      projectsApi.delete(projectId.toString(), accessToken).catch(() => syncProjectsWithServer());
    }
  };

  useEffect(() => {
    if (accessToken && !retrieved) {
      projectsApi
        .getAll(accessToken, 'others')
        .then(({ data: { projects } }) => dispatch(setProjects(projects)));
    }
  }, [accessToken, dispatch, retrieved]);
  return {
    projects,
    submitProject,
    changePermissionsLocally,
    locallyChangedProjects,
    syncProjectsWithServer,
    deleteProject,
  };
};

export { useProjects };
