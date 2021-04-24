import { ProjectCreator } from '../project-creator';
import { Card } from '../presentational/containers/card';
import { Flex } from '../presentational/containers/flex';
import { useProjects } from '../../hooks/use-projects';
import { ProjectCard } from '../project-card';

export const Projects = () => {
  const { projects } = useProjects();
  return (
    <Flex justify='center' flex={1} align='start' bg='darkenedBg'>
      <Flex maxWidth='appMaxWidth' align='start' yPadding={0} childrenGap='big' xPadding={1}>
        <Card header='New project' flex={0.4}>
          <ProjectCreator />
        </Card>
        <Flex direction='column' align='stretch' childrenGap='big'>
          {projects.map(project => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
