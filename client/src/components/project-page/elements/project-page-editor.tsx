import { useWebSocket } from '../../../hooks/use-web-socket';

interface Props {
  projectId: string;
}

const ProjectPageEditor = ({ projectId }: Props) => {
  const { socketStatus, tasks, users, newTask, updateTask, submitNewTask } = useWebSocket(projectId);
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
          <p key={task.taskId}>{task.taskLabel}</p>
        ))}
        <form className='form' onSubmit={submitNewTask}>
          <input className='form__input' type='text' value={newTask} onChange={updateTask} />
          <button className='form__submit-btn'>Add todo</button>
        </form>
      </div>
      <div>
        <h3>Collaborators</h3>
        {users.map(user => (
          <p key={user.uid}>{user.fullName}</p>
        ))}
      </div>
    </div>
  );
};

export default ProjectPageEditor;
