import { useParams } from 'react-router-dom';
import { useAccessProject } from '../../hooks/use-access-project';
import ProjectPageViewer from './elements/project-page-viewer';
import ProjectPageEditor from './elements/project-page-editor';
import ProjectPageUnauthorized from './elements/project-page-unauthorized';

interface Params {
  slug: string;
}

const ProjectPage = () => {
  const { slug } = useParams() as Params;
  const projectId = slug.split('_')[1];
  const { response } = useAccessProject(projectId);

  if (!response) {
    return <p>Retrieving project...</p>;
  }

  const { visibility, role } = response;

  if (role === 'none') {
    if (visibility === 'public') {
      return <ProjectPageViewer />;
    }
    return <ProjectPageUnauthorized />;
  }

  return <ProjectPageEditor projectId={projectId} />;
};

export default ProjectPage;
