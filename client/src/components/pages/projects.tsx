import { ProjectCreator } from '../project-creator';
import { Card } from '../presentational/containers/card';
import { Columns } from '../presentational/containers/columns';
import { InnerMaxWidth } from '../presentational/containers/inner-max-width';
import { Row } from '../presentational/containers/row';
import { useProjects } from '../../hooks/use-projects';

export const Projects = () => {
  const { projects } = useProjects();
  return (
    <Row justify='centered' expand={true} align='start' bg='darkenedBg'>
      <InnerMaxWidth>
        <Columns columns={[0.4, 1]} yPadding='1rem' gap={1}>
          <Card header='New project'>
            <ProjectCreator />
          </Card>
          <Card header='Your projects'>
            {projects.map(project => (
              <p key={project.projectId}>{project.projectTitle}</p>
            ))}
          </Card>
        </Columns>
      </InnerMaxWidth>
    </Row>
  );
};
