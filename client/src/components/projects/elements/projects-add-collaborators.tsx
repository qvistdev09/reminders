import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { renderSearchMatches } from './projects-user-search-match';
import { useUserCatalog } from '../../../hooks/use-user-catalog';
import { useManagePermissions } from '../../../hooks/use-manage-permissions';

interface Props {
  projectId: number;
}

const ProjectsAddCollaborators = ({ projectId }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const { users, selection, addUser } = useUserCatalog(searchValue);
  const {
    addPermission,
    submitPermissionChanges,
    changedPermissions,
  } = useManagePermissions(projectId, () => {}, selection, true);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    submitPermissionChanges();
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <FormSearchWrapper
        suggestions={users}
        render={renderSearchMatches(projectId, addUser)}
      >
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
        <PermissionsGrid
          permissions={changedPermissions}
          showOwner={false}
          changePermission={addPermission}
        />
      )}
      <button className='form__submit-btn utility--margin-top'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
