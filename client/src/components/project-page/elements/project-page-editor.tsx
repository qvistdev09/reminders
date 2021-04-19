import { useWebSocket } from '../../../hooks/use-web-socket';

interface Props {
  projectId: string;
}

const ProjectPageEditor = ({ projectId }: Props) => {
  const { socketStatus, tasks, users } = useWebSocket(projectId);
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
          <p key={task.id}>{task.label}</p>
        ))}
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
