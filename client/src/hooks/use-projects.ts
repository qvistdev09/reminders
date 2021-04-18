import { useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { getUsersProjects, postNewProject } from '../api-service/projects';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { getProjects, setProjects, updateOrAddPermissions } from '../reducers/slices/projects';
import { UserInPermissionsGrid } from '../../../src/types/index';

const useProjects = () => {
  const accessToken = useAccessToken();
  const dispatch = useAppDispatch();
  const { projects, retrieved, locallyChangedProjects } = useAppSelector(getProjects);

  const refetchProjects = () => {
    if (accessToken) {
      getUsersProjects(accessToken).then(({ data: { projects } }) => dispatch(setProjects(projects)));
    }
  };

  const submitProject = (projectTitle: string) => {
    if (accessToken) {
      postNewProject(
        {
          project: {
            projectTitle,
          },
        },
        accessToken
      ).then(() => refetchProjects());
    }
  };

  const modifyPermissions = (projectId: number, permissionChanges: UserInPermissionsGrid[]) => {
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
  return { projects, submitProject, modifyPermissions, locallyChangedProjects, refetchProjects };
};

export { useProjects };
