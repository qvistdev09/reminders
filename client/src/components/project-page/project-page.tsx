import { useParams } from 'react-router-dom';

interface Params {
  slug: string;
}

const ProjectPage = () => {
  const { slug } = useParams() as Params;
  return <p>{slug}</p>;
};

export default ProjectPage;
