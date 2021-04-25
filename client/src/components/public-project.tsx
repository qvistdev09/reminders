import { ProjectAccessResponse } from 'reminders-shared/sharedTypes';
import { useTaskFilterer } from '../hooks/use-task-filterer';
import { Collaborator } from './presentational/collaborator';
import { Card } from './presentational/containers/card';
import { Flex } from './presentational/containers/flex';
import { StaticTask } from './static-task';
import { TaskFilterer } from './task-filterer';

interface Props {
  project: ProjectAccessResponse;
}

export const PublicProject = ({ project }: Props) => {
  const { tasks } = project;
  const { nextFilter, filteredTasks, currentFilter } = useTaskFilterer(tasks || []);
  return (
    <Flex justify='center' align='start' flex={1}>
      <Flex maxWidth='appMaxWidth' align='start' childrenGap='big' xPadding={1}>
        <Flex flex={0.3} direction='column' align='stretch' childrenGap='big'>
          <Card header={`Public project: ${project.title}`}>
            <Collaborator
              user={{
                fullName: `${project.owner?.firstName} ${project.owner?.lastName}`,
                color: 'none',
                role: 'Owner',
                uid: 'none',
              }}
            />
          </Card>
          <TaskFilterer currentFilter={currentFilter} nextFilter={nextFilter} />
        </Flex>
        <Flex flex={0.7} direction='column' align='stretch' childrenGap='big'>
          {filteredTasks.map(task => (
            <StaticTask key={task.taskId} taskObj={task} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
