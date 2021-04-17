import { useState, useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { ProjectObject } from '../../../src/types/index';
import { getUsersProjects, postNewProject } from '../api-service/projects';

const useProjects = (): [ProjectObject[], (projectTitle: string) => void] => {
  const accessToken = useAccessToken();
  const [projects, setProjects] = useState([] as ProjectObject[]);

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
