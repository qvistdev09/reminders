import { Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../../icon/icon';

interface Props {
  projectTitle: string;
  projectId: number;
}

const ProjectRow = ({ projectTitle, projectId }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const icon = expanded ? 'chevronDown' : 'chevronForward';

  return (
    <div className='projects__project-row'>
      <div className='projects__project-row-upper'>
        <Link to={`/projects/${slug}`} className='projects__title-link'>
          <Icon icon='open' color='semiDark' size='medium' />
          {projectTitle}
        </Link>
        <button className='projects__row-btn' onClick={() => setExpanded(!expanded)}>
          Configure
          <Icon icon={icon} color='semiDark' size='small' />
        </button>
      </div>
      {expanded && (
        <div className='projects__project-row-lower'>
          <p>This would be some of the expanded content.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectRow;
