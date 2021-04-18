import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { getSearchMatchRenderFunction } from './projects-user-search-match';
import { useAddNewUsers } from '../../../hooks/use-add-new-users';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';

interface Props {
  projectId: number;
  close: () => void;
}

const ProjectsAddCollaborators = ({ projectId, close }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const { searchMatches, selection, addUser } = useAddNewUsers(searchValue);
  const { addPermission, submitPermissionChanges, unsavedPermissionChanges } = useManagePermissions(
    projectId,
    close,
    selection,
    true
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setStatusMessage('Adding new permissions...');
    submitPermissionChanges();
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <FormSearchWrapper suggestions={searchMatches} renderFunction={getSearchMatchRenderFunction(projectId, addUser)}>
        <FormLabelledInput
          value={searchValue}
          onChange={setSearchValue}
          required={false}
          type='search'
          label='Search for users'
          id='user-search'
        />
      </FormSearchWrapper>
      {selection.length > 0 && (
        <PermissionsGrid permissions={unsavedPermissionChanges} showOwner={false} changePermission={addPermission} />
      )}
      {statusMessage !== '' && <p>{statusMessage}</p>}
      <button className='form__submit-btn utility--margin-top' disabled={statusMessage !== ''}>
        Save
      </button>
    </form>
  );
};

export default ProjectsAddCollaborators;
