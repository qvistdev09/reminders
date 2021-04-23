import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../../icon/icon';
import { ProjectObject } from 'reminders-shared/sharedTypes';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';
import { useManageVisibility } from '../../../hooks/use-manage-visibility';
import { useProjects } from '../../../hooks/use-projects';

interface Props {
  data: ProjectObject;
  openModal: (projectId: number) => void;
}

const ProjectsRow = ({ data, openModal }: Props) => {
  const { setVisibility } = useManageVisibility(data.projectId);
  const { deleteProject } = useProjects();
  const [expanded, setExpanded] = useState(false);
  const { projectTitle, projectId } = data;
  const { addPermission, newPermissionsPreview, removeAllEdits } = useManagePermissions(
    data.projectId,
    data.permissions,
    false,
    true
  );

  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const icon = expanded ? 'chevronDown' : 'chevronForward';

  const onAddClick = () => {
    removeAllEdits();
    openModal(projectId);
  };

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
              <button className='projects__settings-btn' onClick={onAddClick}>
                Add
              </button>
            </div>
            <PermissionsGrid
              permissions={newPermissionsPreview}
              showOwner={true}
              changePermission={addPermission}
            />
          </div>
          <div className='projects__settings-section'>
            <h4 className='projects__settings-header'>Visibility</h4>
            <select onChange={setVisibility} value={data.projectVisibility}>
              <option value='private'>Private</option>
              <option value='authorizedOnly'>Collaborators</option>
              <option value='public'>Public</option>
            </select>
          </div>
          <div className='projects__settings-section'>
            <h4 className='projects__settings-header'>Delete project</h4>
            <button onClick={() => deleteProject(data.projectId)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsRow;
