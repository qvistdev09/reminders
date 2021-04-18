import { UserObj, UserInPermissionsGrid } from '../../../src/types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { useAppUserDetails } from './use-app-user-details';
import { useProjects } from './use-projects';
import { UserObjFilterer } from '../classes/user-obj-filterer';

const setDefaultRoles = (users: UserObj[]) =>
  users.map(
    user =>
      ({
        ...user,
        permissionRole: 'viewer',
      } as UserInPermissionsGrid)
  );

interface HookReturn {
  searchMatches: UserObj[];
  selection: UserInPermissionsGrid[];
  addUser: (userProfile: UserObj) => void;
}

let mounted = true;

const useAddNewUsers = (projectId: number, searchValue?: string): HookReturn => {
  const { projects } = useProjects();
  const accessToken = useAccessToken();
  const appUser = useAppUserDetails();
  const [usersCatalog, setUsersCatalog] = useState([] as UserObj[]);
  const [selectedUsers, setSelectedUsers] = useState([] as UserObj[]);

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

  const addUser = (newUser: UserObj) => {
    setSelectedUsers(prevstate => [...prevstate, newUser]);
  };

  const selectedUsersWithDefaultRole = setDefaultRoles(selectedUsers);

  return {
    searchMatches,
    selection: selectedUsersWithDefaultRole,
    addUser,
  };
};

export { useAddNewUsers };
