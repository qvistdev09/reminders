import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import {
  PermissionOrder,
  PermissionRole,
  ProjectObject,
  ProjectVisibility,
  UserInPermissionsGrid,
} from 'reminders-shared/sharedTypes';
import { findPermission, findProject } from './projects-helpers';

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
    setAll: (state, action: PayloadAction<ProjectObject[]>) => {
      state.projects = action.payload;
      state.retrieved = true;
    },
    addPermissions: (
      state,
      action: PayloadAction<{ projectId: number; newPermissions: UserInPermissionsGrid[] }>
    ) => {
      const { projectId, newPermissions } = action.payload;
      const matchedProject = findProject(projectId, state.projects);
      if (matchedProject) {
        matchedProject.permissions = [...matchedProject.permissions, ...newPermissions];
      }
    },
    editSeveralPermissions: (
      state,
      action: PayloadAction<{ projectId: number; changedPermissions: PermissionOrder[] }>
    ) => {
      const { projectId, changedPermissions } = action.payload;
      const matchedProject = findProject(projectId, state.projects);
      if (matchedProject) {
        matchedProject.permissions = matchedProject.permissions.map(old => {
          const match = changedPermissions.find(newPermission => newPermission.permissionUid === old.uid);
          if (match) {
            return { ...old, permissionRole: match.permissionRole };
          }
          return old;
        });
      }
    },
    changeVisibility(state, action: PayloadAction<{ projectId: number; newSetting: ProjectVisibility }>) {
      const { projectId, newSetting } = action.payload;
      const matchedProject = findProject(projectId, state.projects);
      if (matchedProject) {
        matchedProject.projectVisibility = newSetting;
      }
    },
    delete(state, action: PayloadAction<{ projectId: number }>) {
      state.projects = state.projects.filter(project => project.projectId !== action.payload.projectId);
    },
    editPermission(
      state,
      action: PayloadAction<{ projectId: number; uid: string; newRole: PermissionRole }>
    ) {
      const { projectId, uid, newRole } = action.payload;
      const matchedPermission = findPermission(projectId, uid, state.projects);
      if (matchedPermission) {
        matchedPermission.permissionRole = newRole;
      }
    },
  },
});

export const projectsReducer = projects.actions;

export const getProjects = (state: RootState) => state.projects;

export default projects.reducer;
