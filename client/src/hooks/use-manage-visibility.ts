import { SyntheticEvent } from 'react';
import { ProjectVisibility } from 'reminders-shared/sharedTypes';
import { postNewVisibility } from '../api-service/projects';
import { updateVisibility } from '../reducers/slices/projects';
import { useAppDispatch } from './redux-hooks';
import { useAccessToken } from './use-access-token';
import { useProjects } from './use-projects';

const ascertainVisibilityString = (string: string): string is ProjectVisibility => {
  return string === 'authorizedOnly' || string === 'public' || string === 'private';
};

const useManageVisibility = (projectId: number) => {
  const accessToken = useAccessToken();
  const { syncProjectsWithServer } = useProjects();
  const dispatch = useAppDispatch();

  const setVisibility = (e: SyntheticEvent) => {
    if (e.target instanceof HTMLSelectElement) {
      const { value } = e.target;
      if (ascertainVisibilityString(value) && accessToken) {
        dispatch(updateVisibility({ projectId, newSetting: value }));
        postNewVisibility(projectId.toString(), value, accessToken).catch(() => {
          syncProjectsWithServer();
        });
      }
    }
  };

  return {
    setVisibility,
  };
};

export { useManageVisibility };
