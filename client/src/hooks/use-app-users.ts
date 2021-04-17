import { UserObj } from '../../../src/shared-types/index';
import { PermissionOrder } from '../../../src/shared-types/permission-order';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from '../hooks/use-access-token';

interface HookReturn {
  users: UserObj[];
  selection: PermissionOrder[];
  addUser: (userProfile: UserObj, projectId: number) => void;
}

const useAppUsers = (filterString?: string): HookReturn => {
  const accessToken = useAccessToken();
  const [users, setUsers] = useState([] as UserObj[]);
  const [selection, setSelection] = useState([] as PermissionOrder[]);

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

  const addUser = (userProfile: UserObj, projectId: number) => {
    const newPermission: PermissionOrder = {
      userProfile,
      userPermission: {
        projectId,
        permissionRole: 'viewer',
      },
    };
    setSelection(prevstate => [...prevstate, newPermission]);
  };

  return {
    users: getUsers(),
    selection,
    addUser,
  };
};

export { useAppUsers };
