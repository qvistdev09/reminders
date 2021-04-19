import { useWebSocket } from '../../../hooks/use-web-socket';

interface Props {
  projectId: string;
}

const ProjectPageEditor = ({ projectId }: Props) => {
  const { socketStatus } = useWebSocket(projectId);
  return (
    <div>
      <p>Authed: {`${socketStatus.authenticated}`}</p>
      <p>Role: {socketStatus.role}</p>
    </div>
  );
};

export default ProjectPageEditor;
