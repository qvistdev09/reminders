import { useState, useEffect } from 'react';
import { useAuthenticationStatus } from './use-authentication-status';
import { useAccessToken } from './use-access-token';
import { getSpecificProject } from '../api-service/projects';
import { ProjectAccessResponse } from 'reminders-shared/sharedTypes';

const useAccessProject = (projectId: string) => {
  const [response, setResponse] = useState<ProjectAccessResponse | null>(null);
  const { authenticated } = useAuthenticationStatus();
  const accessToken = useAccessToken();

  useEffect(() => {
    if (authenticated && accessToken) {
      getSpecificProject(projectId, accessToken).then(res => {
        setResponse(res.data);
      });
    } else {
      getSpecificProject(projectId).then(res => {
        setResponse(res.data);
      });
    }
  }, [authenticated, accessToken, projectId]);

  return {
    response,
  };
};

export { useAccessProject };
