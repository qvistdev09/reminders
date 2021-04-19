import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../hooks/use-web-socket';

interface Params {
  slug: string;
}

const ProjectPage = () => {
  const { slug } = useParams() as Params;
  const projectId = slug.split('_')[1];
  const { serverMessage } = useWebSocket(projectId);

  return (
    <div>
      <p>{serverMessage}</p>
      <p>{slug}</p>
    </div>
  );
};

export default ProjectPage;
