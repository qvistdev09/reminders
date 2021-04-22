import { useLiveEdit } from '../../../hooks/use-live-edit';
import { SyntheticEvent, useState } from 'react';
import Task from '../task';
import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { useTaskClickListener } from '../../../hooks/use-task-click-listener';
import { useTaskFilterer } from '../../../hooks/use-task-filterer';

const inEdit = (task: TaskLiveModel, uid: string | null) => {
  if (!uid) {
    return false;
  }
  return task.inEditBy.includes(uid);
};

interface Props {
  projectId: string;
}

const ProjectPageEditor = ({ projectId }: Props) => {
  const [newTaskInput, setNewTaskInput] = useState('');
  const { socketStatus, session, taskActions } = useLiveEdit(projectId);
  const { nextFilter, filteredTasks, currentFilter } = useTaskFilterer(session.tasks);
  useTaskClickListener(taskActions.stopUserEdit);

  const handleNewSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    taskActions.submitNewTask({ taskLabel: newTaskInput });
    setNewTaskInput('');
  };

  return (
    <div>
      <div>
        <h3>Your connection status</h3>
        <p>Authenticated: {socketStatus.authenticated}</p>
        <p>Your role: {socketStatus.role}</p>
      </div>
      <div>
        <h3>Tasks</h3>
        <button onClick={() => nextFilter()}>({currentFilter})</button>
        {filteredTasks.map(taskObj => (
          <Task
            key={taskObj.taskId}
            taskObj={taskObj}
            inEdit={inEdit(taskObj, socketStatus.uid)}
            taskActions={taskActions}
          />
        ))}
        <form className='form' onSubmit={handleNewSubmit}>
          <input
            className='form__input'
            type='text'
            value={newTaskInput}
            onChange={({ target: { value } }) => setNewTaskInput(value)}
          />
          <button className='form__submit-btn'>Add todo</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Collaborators</h3>
        {session.users.map(user => (
          <p
            key={user.uid}
            style={{
              color: 'black',
              backgroundColor: user.color,
              display: 'block',
              padding: '1rem',
              margin: '1rem',
            }}
          >
            {user.fullName}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProjectPageEditor;
