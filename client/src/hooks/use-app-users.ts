import { UserObj } from '../../../src/shared-types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from '../hooks/use-access-token';

interface HookReturn {
  users: UserObj[];
  selection: UserObj[];
  addUser: (user: UserObj) => void;
}

const useAppUsers = (filterString?: string): HookReturn => {
  const accessToken = useAccessToken();
  const [users, setUsers] = useState([] as UserObj[]);
  const [selection, setSelection] = useState([] as UserObj[]);

  useEffect(() => {
    if (accessToken) {
      userApi.getAllAppUsers(accessToken).then(users => setUsers(users));
    }
  }, [accessToken]);

  const getUsers = () => {
    if (filterString) {
      const filteredUsers = users.filter(user => {
        const completeName = `${user.firstName} ${user.lastName}`;
        return new RegExp(filterString, 'i').test(completeName);
      });
      if (filteredUsers.length >= 4) {
        return filteredUsers.slice(0, 4);
      }
      return filteredUsers;
    }
    return [] as UserObj[];
  };

  const addUser = (user: UserObj) => setSelection(prevState => [...prevState, user]);

  return {
    users: getUsers(),
    selection,
    addUser,
  };
};

export { useAppUsers };
