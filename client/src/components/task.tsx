import { SyntheticEvent } from 'react';
import { PktTaskStatus, TaskLiveModel } from 'reminders-shared/sharedTypes';
import { TaskActions } from '../@types/src/components/project-page/task';
import { Close } from './presentational/button/close';
import { TaskTitleBtn } from './presentational/button/task-title-btn';
import { Card } from './presentational/containers/card';
import { Flex } from './presentational/containers/flex';
import { Form } from './presentational/containers/form';
import { Checker } from './presentational/inputs/checker';
import { LabelledInput } from './presentational/inputs/labelled-input';

interface Props {
  taskObj: TaskLiveModel;
  inEdit: boolean;
  taskActions: TaskActions;
}

export const Task = ({ taskObj, inEdit, taskActions }: Props) => {
  const { taskLabel, taskId, taskFinished } = taskObj;
  const { liveChange, deleteTask, taskEditStop, taskEditStart, setTaskStatus, stopUserEdit } = taskActions;

  const handleCommit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    taskEditStop({ taskId: taskObj.taskId });
  };

  const handleChange = (value: string) => {
    liveChange({ taskId, taskLabel: value });
  };

  const editableText = inEdit ? (
    <Form onSubmit={handleCommit} onBlur={handleCommit}>
      <LabelledInput type='text' value={taskLabel} onChange={handleChange} id={`${taskObj.taskId}-input`} />
    </Form>
  ) : (
    <TaskTitleBtn
      label={taskLabel}
      onClick={() => {
        stopUserEdit();
        taskEditStart({ taskId });
      }}
    />
  );

  const statusChangePacket: PktTaskStatus = {
    taskId,
    taskFinished: !taskFinished,
  };

  const checkerToggle = (
    <Checker checked={taskObj.taskFinished} onClick={() => setTaskStatus(statusChangePacket)} />
  );

  return (
    <Card>
      <Flex childrenGap='big'>
        <Flex flex={1} direction='column' align='stretch'>
          {editableText}
        </Flex>
        {checkerToggle}
        <Close close={() => deleteTask({ taskId })} />
      </Flex>
    </Card>
  );
};
