import { useParams } from 'react-router-dom';
import { useAccessProject } from '../hooks/use-access-project';
import { Editor } from './pages/editor';
import { Unauthorized } from './unauthorized';
import { PublicProject } from './public-project';
import { Spinner } from './presentational/spinner/spinner';
import { Flex } from './presentational/containers/flex';

interface Params {
  slug: string;
}

export const ProjectAccessRouter = () => {
  const { slug } = useParams() as Params;
  const projectId = slug.split('_')[1];
  const { response } = useAccessProject(projectId);

  if (!response) {
    return (
      <Flex align='start' justify='center'>
        <Spinner justify='center'>Retrieving project...</Spinner>
      </Flex>
    );
  }

  const { projectVisibility, role } = response;

  if (role === 'none') {
    if (projectVisibility === 'public') {
      return <PublicProject project={response} />;
    }
    return <Unauthorized />;
  }

  if (projectVisibility === 'private') {
    if (role === 'owner') {
      return <Editor projectId={projectId} />;
    }
    return <Unauthorized />;
  }

  return <Editor projectId={projectId} />;
};
