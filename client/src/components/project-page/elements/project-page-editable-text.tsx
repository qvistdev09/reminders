import { TaskLiveModel } from '../../../../../src/types';
import { SyntheticEvent, useState } from 'react';

interface Props {
  task: TaskLiveModel;
  commit: (id: number, str: string) => void;
  liveChange: (id: number, str: string) => void;
}

const ProjectPageEditableText = ({ task, commit, liveChange }: Props) => {
  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(task.taskLabel);

  const handleCommit = () => {
    commit(task.taskId, inputValue);
    setEdit(false);
  };

  const handleEdit = (str: string) => {
    setInputValue(str);
    liveChange(task.taskId, str);
  };

  if (edit) {
    return (
      <form
        onBlur={() => handleCommit()}
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault();
          handleCommit();
        }}
      >
        <input
          type='text'
          value={inputValue}
          onChange={({ target }: { target: HTMLInputElement }) => {
            handleEdit(target.value);
          }}
        />
      </form>
    );
  }

  return (
    <button onClick={() => setEdit(true)} style={{ display: 'block' }}>
      {task.taskLabel}
    </button>
  );
};

export default ProjectPageEditableText;
