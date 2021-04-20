import { SyntheticEvent } from 'react';
import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { TaskActions } from '../../@types/src/components/project-page/task';
import { useTaskLabel } from '../../hooks/use-task-label';

interface Props {
  taskObj: TaskLiveModel;
  taskActions: TaskActions;
}

const Task = ({ taskObj, taskActions }: Props) => {
  const { taskLabel } = taskObj;
  const { inEdit, turnEdit, input, setInput } = useTaskLabel(taskLabel);
  const { liveChange, deleteTask } = taskActions;

  const handleCommit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    turnEdit.off();
  };

  const handleChange = ({ target: { value } }: { target: HTMLInputElement }) => {
    setInput(value);
    liveChange(taskObj.taskId, value);
  };

  const editableText = inEdit ? (
    <form onSubmit={handleCommit} onBlur={handleCommit}>
      <input type='text' value={input} onChange={handleChange} />
    </form>
  ) : (
    <button onClick={() => turnEdit.on()}>{taskLabel}</button>
  );

  return (
    <div>
      {editableText}
      <button onClick={() => deleteTask(taskObj.taskId)}>Delete</button>
    </div>
  );
};

export default Task;
