import { UserObj } from '../../../src/shared-types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from '../hooks/use-access-token';

const useAppUsers = (filterString?: string): UserObj[] => {
  const accessToken = useAccessToken();
  const [users, setUsers] = useState([] as UserObj[]);

  useEffect(() => {
    if (accessToken) {
      userApi.getAllAppUsers(accessToken).then(users => setUsers(users));
    }
  }, [accessToken]);

  if (filterString) {
    return users.filter(user => {
      const completeName = `${user.firstName} ${user.lastName}`;
      return new RegExp(filterString, 'i').test(completeName);
    });
  }

  return [] as UserObj[];
};

export { useAppUsers };
