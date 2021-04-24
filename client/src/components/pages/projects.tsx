import { ProjectCreator } from '../project-creator';
import { Card } from '../presentational/containers/card';
import { Flex } from '../presentational/containers/flex';
import { useProjects } from '../../hooks/use-projects';

export const Projects = () => {
  const { projects } = useProjects();
  return (
    <Flex justify='center' flex={1} align='start' bg='darkenedBg'>
      <Flex maxWidth='appMaxWidth' align='start' yPadding={1} childrenGap='big'>
        <Card header='New project' flex={0.4}>
          <ProjectCreator />
        </Card>
        <Card header='Your projects' flex={1}>
          {projects.map(project => (
            <p key={project.projectId}>{project.projectTitle}</p>
          ))}
        </Card>
      </Flex>
    </Flex>
  );
};
