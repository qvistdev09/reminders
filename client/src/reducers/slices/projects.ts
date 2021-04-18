import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { ProjectObject, UserInPermissionsGrid } from '../../../../src/types/index';

interface ProjectsState {
  projects: ProjectObject[];
  retrieved: boolean;
  locallyChangedProjects: number[];
}

const initialState: ProjectsState = {
  projects: [],
  retrieved: false,
  locallyChangedProjects: [],
};

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectObject[]>) => {
      state.projects = action.payload;
      state.retrieved = true;
      state.locallyChangedProjects = [];
    },
    updateOrAddPermissions: (
      state,
      action: PayloadAction<{ projectId: number; permissionChanges: UserInPermissionsGrid[] }>
    ) => {
      const { projectId, permissionChanges } = action.payload;
      const matchedProject = state.projects.find(project => project.projectId === projectId);
      if (matchedProject) {
        state.locallyChangedProjects.push(projectId);
        const updatedPermissions = matchedProject.permissions.map(oldPermission => {
          const updatedVersion = permissionChanges.find(newPermission => newPermission.uid === oldPermission.uid);
          if (updatedVersion) {
            return updatedVersion;
          }
          return oldPermission;
        });
        const newPermissions = permissionChanges.filter(newPermission => {
          const existingObject = updatedPermissions.find(permission => permission.uid === newPermission.uid);
          if (existingObject) {
            return false;
          }
          return true;
        });
        matchedProject.permissions = [...updatedPermissions, ...newPermissions];
      }
    },
  },
});

export const { setProjects, updateOrAddPermissions } = projects.actions;

export const getProjects = (state: RootState) => state.projects;

export default projects.reducer;
