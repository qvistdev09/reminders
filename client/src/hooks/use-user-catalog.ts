import { UserObj } from '../../../src/types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from '../hooks/use-access-token';

// filter also by existing permissions in project

interface HookReturn {
  users: UserObj[];
  selection: UserObj[];
  addUser: (userProfile: UserObj) => void;
}

const useUserCatalog = (filterString?: string): HookReturn => {
  const accessToken = useAccessToken();
  const [users, setUsers] = useState([] as UserObj[]);
  const [selection, setSelection] = useState([] as UserObj[]);

  useEffect(() => {
    if (accessToken) {
      userApi.getAllAppUsers(accessToken).then(users => setUsers(users));
    }
  }, [accessToken]);

  const filterBySelected = () => {
    return users.filter(user => {
      const match = selection.find(selectedUser => selectedUser.uid === user.uid);
      if (match) {
        return false;
      }
      return true;
    });
  };

  const filterBySearchValue = (array: UserObj[]) => {
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

  const getUsers = () => {
    return filterBySearchValue(filterBySelected());
  };

  const addUser = (newUser: UserObj) => {
    setSelection(prevstate => [...prevstate, newUser]);
  };

  return {
    users: getUsers(),
    selection,
    addUser,
  };
};

export { useUserCatalog };
