import { useState, useEffect } from 'react';
import { getSpecificProject } from '../api-service/projects';
import { ProjectAccessResponse } from 'reminders-shared/sharedTypes';
import { useOktaAuth } from '@okta/okta-react';

const useAccessProject = (projectId: string) => {
  const { authState } = useOktaAuth();
  const [response, setResponse] = useState<ProjectAccessResponse | null>(null);

  useEffect(() => {
    const accessToken = authState.accessToken?.accessToken;
    getSpecificProject(projectId, accessToken).then(res => {
      setResponse(prev => {
        if (!prev || prev.role === 'none') {
          return res.data;
        }
        return prev;
      });
    });
  }, [projectId, authState.accessToken]);

  return {
    response,
  };
};

export { useAccessProject };
