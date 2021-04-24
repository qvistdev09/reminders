import { PermissionRole, ProjectObject } from 'reminders-shared/sharedTypes';
import { ControlledError } from '../../classes/controlled-error';
import { Project } from '../../database/root';
import { PermissionInstance } from '../../database/schemas/permission';
import { ProjectInstance } from '../../database/schemas/project';
import { NewProject } from '../../types';

export const getProjectsByUserId = (userId: string) =>
  Project.findAll({
    where: {
      projectOwner: userId,
    },
  });

export const createNewProject = (newProject: NewProject) => {
  const { projectTitle, projectOwner, projectVisibility } = newProject;
  return Project.create({
    projectTitle,
    projectOwner,
    projectVisibility,
  });
};

export const userIsOwner = async (projectOwner: string, projectId: number) => {
  const matchedProject = await Project.findOne({ where: { projectId, projectOwner } }).catch(() => {
    throw new ControlledError('Database malfunction', 500);
  });
  if (!matchedProject) {
    throw new ControlledError('Unauthorized', 401);
  }
};

export const findProject = (projectId: number) => Project.findOne({ where: { projectId } });

export const establishRole = (permissions: PermissionInstance[], project: ProjectInstance, uid: string): PermissionRole | 'owner' | 'none' => {
  if (project.projectOwner === uid) {
    return 'owner';
  }
  const matchedPermission = permissions.find(permission => permission.permissionUid === uid);
  if (matchedPermission) {
    return matchedPermission.permissionRole;
  }
  return 'none';
};
