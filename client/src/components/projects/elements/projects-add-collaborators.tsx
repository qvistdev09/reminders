import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { getSearchMatchRenderFunction } from './projects-user-search-match';
import { useAddNewUsers } from '../../../hooks/use-add-new-users';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';

interface Props {
  projectId: number;
}

const ProjectsAddCollaborators = ({ projectId }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const { searchMatches, selection, addUser } = useAddNewUsers(searchValue);
  const { addPermission, submitPermissionChanges, unsavedPermissionChanges } = useManagePermissions(
    projectId,
    () => {},
    selection,
    true
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    submitPermissionChanges();
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <FormSearchWrapper suggestions={searchMatches} renderFunction={getSearchMatchRenderFunction(projectId, addUser)}>
        <FormLabelledInput
          value={searchValue}
          onChange={setSearchValue}
          required={true}
          type='search'
          label='Search for users'
          id='user-search'
        />
      </FormSearchWrapper>
      {selection.length > 0 && (
        <PermissionsGrid permissions={unsavedPermissionChanges} showOwner={false} changePermission={addPermission} />
      )}
      <button className='form__submit-btn utility--margin-top'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
