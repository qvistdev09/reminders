import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../hooks/use-web-socket';

interface Params {
  slug: string;
}

const ProjectPage = () => {
  const { serverMessage } = useWebSocket();
  const { slug } = useParams() as Params;
  return (
    <div>
      <p>{serverMessage}</p>
      <p>{slug}</p>
    </div>
  );
};

export default ProjectPage;
