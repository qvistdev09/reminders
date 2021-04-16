import { useState, useEffect } from 'react';
import { userApi } from '../../../api-service/user';
import { UserObj } from '../../../../../src/shared-types/index';
import { useOktaAuth } from '@okta/okta-react';
import FormLabelledInput from '../../form/elements/form-labelled-input';

const ProjectsAddCollaborators = () => {
  const { authState } = useOktaAuth();
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([] as UserObj[]);

  useEffect(() => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      userApi.getAllAppUsers(accessToken).then(users => setUsers(users));
    }
  }, [authState.accessToken]);

  const filteredUsers =
    searchValue === ''
      ? ([] as UserObj[])
      : users.filter(user => {
          const completeName = `${user.firstName} ${user.lastName}`;
          return new RegExp(searchValue, 'i').test(completeName);
        });

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
      {filteredUsers.map(user => (
        <p key={user.uid}>{`${user.firstName} ${user.lastName}`}</p>
      ))}
      <button className='form__submit-btn'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
