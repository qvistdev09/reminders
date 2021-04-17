import { useState } from 'react';
import { useAppUsers } from '../../../hooks/use-app-users';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { renderSearchMatches } from './projects-user-search-match';

interface Props {
  projectId: number;
}

const ProjectsAddCollaborators = ({ projectId }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const { users, selection, addUser } = useAppUsers(searchValue);

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
        <PermissionsGrid permissions={selection} showOwner={false} />
      )}
      <button className='form__submit-btn utility--margin-top'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
