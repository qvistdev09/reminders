import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { ProjectWithPermissions } from '../../../../../src/api/services/permissions-service';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../../icon/icon';

interface Props {
  data: ProjectWithPermissions;
}

const ProjectRow = ({ data }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { projectTitle, projectId } = data.project;
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const icon = expanded ? 'chevronDown' : 'chevronForward';

  return (
    <div className='projects__project-row'>
      <div className='projects__project-row-upper'>
        <Link to={`/projects/${slug}`} className='projects__title-link'>
          <Icon icon='open' color='semiDark' size='medium' />
          <h3>{projectTitle}</h3>
        </Link>
        <button className='projects__row-btn' onClick={() => setExpanded(!expanded)}>
          Configure
          <Icon icon={icon} color='semiDark' size='small' />
        </button>
      </div>
      {expanded && (
        <div className='projects__project-row-lower'>
          <div className='projects__settings-section'>
            <div className='projects__settings-header-container'>
              <h4 className='projects__settings-header'>Permissions</h4>
              <button className='projects__settings-btn'>Add</button>
            </div>
            <PermissionsGrid permissions={data.projectPermissions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRow;
