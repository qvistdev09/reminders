import { useWebSocket } from '../../../hooks/use-web-socket';

import EditableText from './project-page-editable-text';

interface Props {
  projectId: string;
}

const ProjectPageEditor = ({ projectId }: Props) => {
  const {
    socketStatus,
    tasks,
    users,
    newTask,
    updateTask,
    submitNewTask,
    deleteTask,
    liveChange,
  } = useWebSocket(projectId);
  return (
    <div>
      <div>
        <h3>Your connection status</h3>
        <p>Authenticated: {socketStatus.authenticated}</p>
        <p>Your role: {socketStatus.role}</p>
      </div>
      <div>
        <h3>Tasks</h3>
        {tasks.map(task => (
          <div key={task.taskId} style={{ border: '1px solid black', padding: '0.5rem', margin: '0.5rem' }}>
            <EditableText task={task} commit={() => {}} liveChange={liveChange} />
            <button className='form__submit-btn' onClick={() => deleteTask(task.taskId)}>
              Delete task
            </button>
          </div>
        ))}
        <form className='form' onSubmit={submitNewTask}>
          <input className='form__input' type='text' value={newTask} onChange={updateTask} />
          <button className='form__submit-btn'>Add todo</button>
        </form>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Collaborators</h3>
        {users.map(user => (
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
