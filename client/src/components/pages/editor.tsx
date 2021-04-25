import { useLiveEdit } from '../../hooks/use-live-edit';
import { Task } from '../task';
import { useTaskClickListener } from '../../hooks/use-task-click-listener';
import { useTaskFilterer } from '../../hooks/use-task-filterer';
import { Flex } from '../presentational/containers/flex';
import { Card } from '../presentational/containers/card';
import { Text } from '../presentational/texts/text';
import { Collaborator } from '../presentational/collaborator';
import { TaskCreator } from '../task-creator';
import { TaskFilterer } from '../task-filterer';

interface Props {
  projectId: string;
  editable?: boolean;
}

export const Editor = ({ projectId, editable = true }: Props) => {
  const { socketStatus, session, taskActions } = useLiveEdit(projectId);
  const { nextFilter, filteredTasks, currentFilter } = useTaskFilterer(session.tasks);
  useTaskClickListener(taskActions.stopUserEdit);

  return (
    <Flex justify='center' align='start' flex={1}>
      <Flex maxWidth='appMaxWidth' align='start' childrenGap='big' xPadding={1}>
        <Flex flex={0.3} direction='column' align='stretch' childrenGap='big'>
          <Card header='Connection status'>
            <Flex direction='column' childrenGap='small' align='start'>
              <Text weight='strong'>{socketStatus.authenticated ? 'Connected' : 'Connecting'}</Text>
              {socketStatus.authenticated && <Text>{`Your role: ${socketStatus.role}`}</Text>}
            </Flex>
          </Card>
          <Card header='Create task'>
            <TaskCreator onCreate={taskLabel => taskActions.submitNewTask({ taskLabel })} />
          </Card>
          <Card header='Collaborators online'>
            <Flex direction='column' childrenGap='big' align='stretch'>
              {session.users.map(user => (
                <Collaborator key={user.uid} user={user} />
              ))}
            </Flex>
          </Card>
        </Flex>
        <Flex flex={0.7} direction='column' align='stretch' childrenGap='big'>
          <TaskFilterer currentFilter={currentFilter} nextFilter={nextFilter} />
          {filteredTasks.map(task => (
            <Task
              key={task.taskId}
              taskObj={task}
              inEdit={task.inEditBy.length > 0}
              taskActions={taskActions}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
