import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { ProjectObject, UserInPermissionsGrid } from '../../../../src/types/index';

interface ProjectsState {
  projects: ProjectObject[];
  retrieved: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  retrieved: false,
};

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectObject[]>) => {
      state.projects = action.payload;
      state.retrieved = true;
    },
    updateOrAddPermissions: (
      state,
      action: PayloadAction<{ projectId: number; permissionChanges: UserInPermissionsGrid[] }>
    ) => {
      const { projectId, permissionChanges } = action.payload;
      const matchedProject = state.projects.find(project => project.projectId === projectId);
      if (matchedProject) {
        matchedProject.permissions = matchedProject.permissions.filter(permission => {
          const foundNewVersion = permissionChanges.find(newPermission => newPermission.uid === permission.uid);
          if (foundNewVersion) {
            return false;
          }
          return true;
        });
        matchedProject.permissions = [...matchedProject.permissions, ...permissionChanges];
      }
    },
  },
});

export const { setProjects, updateOrAddPermissions } = projects.actions;

export const getProjects = (state: RootState) => state.projects;

export default projects.reducer;
