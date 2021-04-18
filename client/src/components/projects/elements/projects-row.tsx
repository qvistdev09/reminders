import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../../icon/icon';
import { ProjectObject } from '../../../../../src/types/index';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';
import { useProjects } from '../../../hooks/use-projects';

interface Props {
  data: ProjectObject;
  openModal: (projectId: number) => void;
}

const ProjectsRow = ({ data, openModal }: Props) => {
  const isSavingChanges = useProjects().locallyChangedProjects.includes(data.projectId);
  const [expanded, setExpanded] = useState(false);
  const { projectTitle, projectId } = data;
  const {
    addPermission,
    newPermissionsPreview,
    unsavedChanges,
    removeAllEdits,
    submitPermissionChanges,
  } = useManagePermissions(data.projectId, data.permissions, false);

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
            {unsavedChanges && (
              <div className='containers__info'>
                <p className='containers__text'>You have unsaved changes</p>
                <button className='containers__confirm-btn' onClick={() => submitPermissionChanges()}>
                  Confirm
                </button>
                <button className='containers__cancel-btn' onClick={() => removeAllEdits()}>
                  Cancel
                </button>
              </div>
            )}
            {isSavingChanges && <p>Saving changes...</p>}
            <PermissionsGrid permissions={newPermissionsPreview} showOwner={true} changePermission={addPermission} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsRow;
