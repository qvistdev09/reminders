import { useState } from 'react';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { renderSearchMatches } from './projects-user-search-match';
import { useUserCatalog } from '../../../hooks/use-user-catalog';
import { UserInPermissionsGrid } from '../../../../../src/types/index';

interface Props {
  projectId: number;
}

const ProjectsAddCollaborators = ({ projectId }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const { users, selection, addUser } = useUserCatalog(searchValue);

  const addedUsers: UserInPermissionsGrid[] = selection.map(user => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    uid: user.uid,
    permissionRole: 'viewer',
  }));

  return (
    <form className='form'>
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
        <PermissionsGrid permissions={addedUsers} showOwner={false} />
      )}
      <button className='form__submit-btn utility--margin-top'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
