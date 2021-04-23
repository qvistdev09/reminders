import { useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { getUsersProjects, postNewProject } from '../api-service/projects';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { getProjects, setProjects, updateOrAddPermissions } from '../reducers/slices/projects';
import { UserInPermissionsGrid } from 'reminders-shared/sharedTypes';

const useProjects = () => {
  const accessToken = useAccessToken();
  const dispatch = useAppDispatch();
  const { projects, retrieved, locallyChangedProjects } = useAppSelector(getProjects);

  const syncProjectsWithServer = () => {
    if (accessToken) {
      getUsersProjects(accessToken).then(({ data: { projects } }) => dispatch(setProjects(projects)));
    }
  };

  const submitProject = (projectTitle: string) => {
    if (accessToken) {
      postNewProject(
        {
          projectTitle,
          projectVisibility: 'authorizedOnly',
        },
        accessToken
      ).then(() => syncProjectsWithServer());
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

  useEffect(() => {
    if (accessToken && !retrieved) {
      getUsersProjects(accessToken).then(({ data: { projects } }) => dispatch(setProjects(projects)));
    }
  }, [accessToken, dispatch, retrieved]);
  return {
    projects,
    submitProject,
    changePermissionsLocally,
    locallyChangedProjects,
    syncProjectsWithServer,
  };
};

export { useProjects };
