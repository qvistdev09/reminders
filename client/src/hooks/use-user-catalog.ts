import { UserObj } from '../../../src/types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from '../hooks/use-access-token';
import { UserInPermissionsGrid } from '../../../src/types/index';

// filter also by existing permissions in project

interface HookReturn {
  users: UserInPermissionsGrid[];
  selection: UserInPermissionsGrid[];
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

  const filteredUsers: UserInPermissionsGrid[] = users
    .filter(user => {
      if (!filterString) {
        return false;
      }
      const match = selection.find(selectedUser => selectedUser.uid === user.uid);
      if (match) {
        return false;
      }
      const completeName = `${user.firstName} ${user.lastName}`;
      return new RegExp(filterString, 'i').test(completeName);
    })
    .map(filteredUser => ({
      ...filteredUser,
      permissionRole: 'viewer',
    }));

  const addUser = (newUser: UserObj) => {
    setSelection(prevstate => [...prevstate, newUser]);
  };

  const formattedSelection: UserInPermissionsGrid[] = selection.map(userObj => ({
    ...userObj,
    permissionRole: 'viewer',
  }));

  return {
    users: filteredUsers,
    selection: formattedSelection,
    addUser,
  };
};

export { useUserCatalog };
