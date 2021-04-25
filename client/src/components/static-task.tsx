import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { TaskTitleBtn } from './presentational/button/task-title-btn';
import { Card } from './presentational/containers/card';
import { Flex } from './presentational/containers/flex';
import { Checker } from './presentational/inputs/checker';

interface Props {
  taskObj: TaskLiveModel;
}

export const StaticTask = ({ taskObj }: Props) => {
  const { taskLabel } = taskObj;
  const checkerToggle = <Checker checked={taskObj.taskFinished} onClick={() => {}} />;

  return (
    <Card>
      <Flex childrenGap='big'>
        <Flex flex={1} direction='column' align='stretch'>
          <TaskTitleBtn label={taskLabel} onClick={() => {}} />
        </Flex>
        {checkerToggle}
      </Flex>
    </Card>
  );
};
