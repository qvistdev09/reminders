import { useState, useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { ProjectWithPermissions } from '../../../src/api/services/permissions-service';
import { getUsersProjects, postNewProject } from '../api-service/projects';

const useProjects = (): [ProjectWithPermissions[], (projectTitle: string) => void] => {
  const accessToken = useAccessToken();
  const [projects, setProjects] = useState([] as ProjectWithPermissions[]);

  const refetchProjects = () => {
    if (accessToken) {
      getUsersProjects(accessToken).then(({ data: { projects } }) =>
        setProjects(projects)
      );
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

  useEffect(() => {
    if (accessToken) {
      getUsersProjects(accessToken).then(({ data: { projects } }) =>
        setProjects(projects)
      );
    }
  }, [accessToken]);
  return [projects, submitProject];
};

export { useProjects };
