import { useState } from 'react';
import { useAppUsers } from '../../../hooks/use-app-users';
import FormLabelledInput from '../../form/elements/form-labelled-input';

const ProjectsAddCollaborators = () => {
  const [searchValue, setSearchValue] = useState('');
  const users = useAppUsers(searchValue);

  return (
    <form className='form'>
      <FormLabelledInput
        value={searchValue}
        onChange={setSearchValue}
        required={true}
        type='text'
        label='Search for users'
        id='user-search'
      />
      {users.map(user => (
        <p key={user.uid}>{`${user.firstName} ${user.lastName}`}</p>
      ))}
      <button className='form__submit-btn'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
