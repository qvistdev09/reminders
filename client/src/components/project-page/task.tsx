import { SyntheticEvent, useState } from 'react';
import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { TaskActions } from '../../@types/src/components/project-page/task';

interface Props {
  taskObj: TaskLiveModel;
  inEdit: boolean;
  taskActions: TaskActions;
}

const Task = ({ taskObj, inEdit, taskActions }: Props) => {
  const { taskLabel, taskId } = taskObj;
  const [input, setInput] = useState('');
  const { liveChange, deleteTask, taskEditStop, taskEditStart } = taskActions;

  const handleCommit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    taskEditStop({ taskId: taskObj.taskId });
  };

  const handleChange = ({ target: { value } }: { target: HTMLInputElement }) => {
    setInput(value);
    liveChange({ taskId, taskLabel: value });
  };

  const editableText = inEdit ? (
    <form onSubmit={handleCommit} onBlur={handleCommit}>
      <input type='text' value={input} onChange={handleChange} />
    </form>
  ) : (
    <button onClick={() => taskEditStart({ taskId })}>{taskLabel}</button>
  );

  return (
    <div id={`task-${taskObj.taskId}`}>
      {editableText}
      <button onClick={() => deleteTask({ taskId })}>Delete</button>
    </div>
  );
};

export default Task;
