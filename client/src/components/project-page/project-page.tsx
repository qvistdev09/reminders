import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../hooks/use-web-socket';
import ProjectPageViewer from './elements/project-page-viewer';
import ProjectPageEditor from './elements/project-page-editor';
import { useAuthenticationStatus } from '../../hooks/use-authentication-status';
import { useState } from 'react';

interface Params {
  slug: string;
}

type AccessStatus = 'pending' | 'somePermission' | 'noPermission';

const ProjectPage = () => {
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('pending');
  const { authenticated } = useAuthenticationStatus();
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
