import { useState, useEffect } from 'react';
import { ProjectObject } from 'reminders-shared/sharedTypes';
import { projectsApi } from '../../api-service/projects';
import { useAccessToken } from '../../hooks/use-access-token';
import { Card } from '../presentational/containers/card';
import { Flex } from '../presentational/containers/flex';
import { Text } from '../presentational/texts/text';
import { ProjectCard } from '../project-card';

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
    <Flex justify='center' flex={1} align='start' bg='darkenedBg'>
      <Flex maxWidth='appMaxWidth' align='start' yPadding={0} childrenGap='big' xPadding={1}>
        <Card header='Shared with you' flex={0.3}>
          <Text>You have been invited to:</Text>
          <Text weight='strong'>{projects.length.toString()} projects</Text>
        </Card>
        <Flex direction='column' align='stretch' childrenGap='big' flex={0.7}>
          {projects.length > 0 &&
            projects.map(project => <ProjectCard key={project.projectId} project={project} owned={false} />)}
          {projects.length === 0 && (
            <Card>
              <Text>You have not been invited to any projects yet.</Text>
            </Card>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SharedWithYou;
