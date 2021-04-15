import { Link } from 'react-router-dom';

interface Props {
  projectTitle: string;
  projectId: number;
}

const ProjectRow = ({ projectTitle, projectId }: Props) => {
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  return (
    <div className='projects__project-row'>
      <Link to={`/projects/${slug}`}>{projectTitle}</Link>
    </div>
  );
};

export default ProjectRow;
