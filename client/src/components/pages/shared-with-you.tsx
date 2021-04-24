import { useState, useEffect } from 'react';
import { ProjectObject } from 'reminders-shared/sharedTypes';
import { projectsApi } from '../../api-service/projects';
import { useAccessToken } from '../../hooks/use-access-token';
import SharedProject from '../SharedProject';

let mounted = true;
const SharedWithYou = () => {
  const accessToken = useAccessToken();
  const [projects, setProjects] = useState<ProjectObject[]>([]);

  useEffect(() => {
    mounted = true;
    if (accessToken) {
      projectsApi.getAll(accessToken, 'others').then(res => {
        if (mounted) {
          setProjects(res.data.projects);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [accessToken]);
  return (
    <div>
      {projects.map(project => (
        <SharedProject key={project.projectId} project={project} />
      ))}
    </div>
  );
};

export default SharedWithYou;
