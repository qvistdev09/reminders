import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { ProjectObject, ProjectVisibility, UserInPermissionsGrid } from 'reminders-shared/sharedTypes';

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
        if (!state.locallyChangedProjects.includes(projectId)) {
          state.locallyChangedProjects.push(projectId);
        }
        const updatedPermissions = matchedProject.permissions.map(oldPermission => {
          const updatedVersion = permissionChanges.find(
            newPermission => newPermission.uid === oldPermission.uid
          );
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
    updateVisibility(state, action: PayloadAction<{ projectId: number; newSetting: ProjectVisibility }>) {
      const matchedProject = state.projects.find(project => project.projectId === action.payload.projectId);
      if (matchedProject) {
        matchedProject.projectVisibility = action.payload.newSetting;
      }
    },
    localDelete(state, action: PayloadAction<{ projectId: number }>) {
      state.projects = state.projects.filter(project => project.projectId !== action.payload.projectId);
    },
  },
});

export const { setProjects, updateOrAddPermissions, updateVisibility, localDelete } = projects.actions;

export const getProjects = (state: RootState) => state.projects;

export default projects.reducer;
