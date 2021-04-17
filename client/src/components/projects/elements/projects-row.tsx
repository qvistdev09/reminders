import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../../icon/icon';
import { ProjectObject } from '../../../../../src/types/index';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';

interface Props {
  data: ProjectObject;
  openModal: (projectId: number) => void;
}

const ProjectsRow = ({ data, openModal }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { projectTitle, projectId } = data;
  const { addPermission, changedPermissions } = useManagePermissions(
    data.projectId,
    () => {},
    data.permissions,
    false
  );

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
              <button
                className='projects__settings-btn'
                onClick={() => openModal(projectId as number)}
              >
                Add
              </button>
            </div>
            <PermissionsGrid
              permissions={changedPermissions}
              showOwner={true}
              changePermission={addPermission}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsRow;
