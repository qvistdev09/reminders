import { useOktaAuth } from '@okta/okta-react';
import { UserObj } from '../../../src/shared-types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';

const useAppUsers = (filterString?: string): UserObj[] => {
  const { authState } = useOktaAuth();
  const [users, setUsers] = useState([] as UserObj[]);

  useEffect(() => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      userApi.getAllAppUsers(accessToken).then(users => setUsers(users));
    }
  }, [authState.accessToken]);

  if (filterString) {
    return users.filter(user => {
      const completeName = `${user.firstName} ${user.lastName}`;
      return new RegExp(filterString, 'i').test(completeName);
    });
  }

  return [] as UserObj[];
};

export { useAppUsers };
