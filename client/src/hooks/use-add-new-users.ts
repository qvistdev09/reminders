import { UserObj, UserInPermissionsGrid, ProjectObject } from '../../../src/types/index';
import { userApi } from '../api-service/user';
import { useState, useEffect } from 'react';
import { useAccessToken } from './use-access-token';
import { useAppUserDetails } from './use-app-user-details';
import { useProjects } from './use-projects';

const filterBySearchAndSelection = (all: UserObj[], selected: UserObj[], searchValue: string | undefined) => {
  const arrayWithoutSelected = all.filter(user => {
    const match = selected.find(selectedUser => selectedUser.uid === user.uid);
    if (match) {
      return false;
    }
    return true;
  });

  const arrayFilteredBySearchValue = arrayWithoutSelected.filter(user => {
    if (!searchValue) {
      return true;
    }
    const completeName = `${user.firstName} ${user.lastName}`;
    return new RegExp(searchValue, 'i').test(completeName);
  });

  return arrayFilteredBySearchValue;
};

const setDefaultRoles = (users: UserObj[]) =>
  users.map(
    user =>
      ({
        ...user,
        permissionRole: 'viewer',
      } as UserInPermissionsGrid)
  );

const limitSearchResults = <T>(max: number, array: T[]) => {
  if (array.length <= max) {
    return array;
  }
  return array.slice(0, max);
};

const removeProjectOwner = (uid: string | undefined, matches: UserObj[]) => {
  if (uid) {
    return matches.filter(user => user.uid !== uid);
  }
  return matches;
};

const removeUsersAlreadyInProject = (matches: UserObj[], projects: ProjectObject[], projectId: number) => {
  const matchedProject = projects.find(project => project.projectId === projectId);
  if (!matchedProject) {
    return matches;
  }
  return matches.filter(user => {
    const foundUser = matchedProject.permissions.find(permission => permission.uid === user.uid);
    if (foundUser) {
      return false;
    }
    return true;
  });
};

const filterAndLimit = (
  all: UserObj[],
  selected: UserObj[],
  searchValue: string | undefined,
  projects: ProjectObject[],
  projectId: number,
  projectOwner: string
) => {
  const filtered = filterBySearchAndSelection(all, selected, searchValue);
  const withoutAlreadyAdded = removeUsersAlreadyInProject(filtered, projects, projectId);
  const withoutOwner = removeProjectOwner(projectOwner, withoutAlreadyAdded);
  return limitSearchResults(5, withoutOwner);
};

// filter also by existing permissions in project

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

  const searchMatches: UserObj[] = filterAndLimit(
    usersCatalog,
    selectedUsers,
    searchValue,
    projects,
    projectId,
    appUser.uid
  );

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
