import { useState } from 'react';
import { useAppUsers } from '../../../hooks/use-app-users';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import { renderSearchMatches } from './projects-user-search-match';

const ProjectsAddCollaborators = () => {
  const [searchValue, setSearchValue] = useState('');
  const { users, selection, addUser } = useAppUsers(searchValue);

  return (
    <form className='form'>
      <FormSearchWrapper suggestions={users} render={renderSearchMatches}>
        <FormLabelledInput
          value={searchValue}
          onChange={setSearchValue}
          required={true}
          type='text'
          label='Search for users'
          id='user-search'
        />
      </FormSearchWrapper>
      <button className='form__submit-btn'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
