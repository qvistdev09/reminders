import { UserObj, UserInPermissionsGrid, PermissionOrder } from 'reminders-shared/sharedTypes';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { useAppUserDetails } from './use-app-user-details';
import { useProjects } from './use-projects';
import { UserObjFilterer } from '../classes/user-obj-filterer';

let mounted = true;

const useAddNewUsers = (projectId: number, searchValue?: string) => {
  const { projects } = useProjects();
  const accessToken = useAccessToken();
  const appUser = useAppUserDetails();
  const [usersCatalog, setUsersCatalog] = useState([] as UserObj[]);
  const [selectedUsers, setSelectedUsers] = useState([] as UserInPermissionsGrid[]);

  useEffect(() => {
    mounted = true;
    if (accessToken) {
      userApi.getAllAppUsers(accessToken).then(users => {
        if (mounted) {
          setUsersCatalog(users);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const searchMatches: UserObj[] = new UserObjFilterer(usersCatalog)
    .removeOwner(appUser.uid)
    .removeSelected(selectedUsers)
    .removeUsersAlreadyInProject(projects, projectId)
    .filterBySearch(searchValue)
    .limitResults(4);

  const changeRole = (change: PermissionOrder) => {
    setSelectedUsers(prevState => {
      return prevState.map(prevUser => {
        if (prevUser.uid === change.permissionUid) {
          return {
            ...prevUser,
            permissionRole: change.permissionRole,
          };
        }
        return prevUser;
      });
    });
  };

  const addUser = (newUser: UserObj) => {
    const newUserObj: UserInPermissionsGrid = {
      ...newUser,
      permissionRole: 'viewer',
    };
    setSelectedUsers(prevstate => [...prevstate, newUserObj]);
  };

  return {
    searchMatches,
    selection: selectedUsers,
    addUser,
    changeRole,
  };
};

export { useAddNewUsers };
