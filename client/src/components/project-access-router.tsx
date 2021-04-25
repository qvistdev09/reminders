import { useParams } from 'react-router-dom';
import { useAccessProject } from '../hooks/use-access-project';
import ProjectPageViewer from './project-page/elements/project-page-viewer';
import { Editor } from './pages/editor';
import ProjectPageUnauthorized from './project-page/elements/project-page-unauthorized';

interface Params {
  slug: string;
}

export const ProjectAccessRouter = () => {
  const { slug } = useParams() as Params;
  const projectId = slug.split('_')[1];
  const { response } = useAccessProject(projectId);

  if (!response) {
    return <p>Retrieving project...</p>;
  }

  const { projectVisibility, role } = response;

  if (role === 'none') {
    if (projectVisibility === 'public') {
      return <ProjectPageViewer />;
    }
    return <ProjectPageUnauthorized />;
  }

  if (projectVisibility === 'private') {
    if (role === 'owner') {
      return <Editor projectId={projectId} />;
    }
    return <ProjectPageUnauthorized />;
  }

  return <Editor projectId={projectId} />;
};
