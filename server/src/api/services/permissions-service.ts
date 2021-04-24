import { Permission } from '../../database/root';
import { PermissionInstance } from '../../database/schemas/permission';
import { ProjectInstance } from '../../database/schemas/project';
import { PermissionRole, UserObj } from 'reminders-shared/sharedTypes';

export interface PermissionInstanceWithName {
  userPermission: PermissionInstance;
  userProfile: UserObj;
}

export interface ProjectWithPermissions {
  project: ProjectInstance;
  projectPermissions: PermissionInstanceWithName[];
}

export const handlePermissionChange = async (
  permissionUid: string,
  projectId: number,
  permissionRole: PermissionRole
) => {
  const preExistingMatch = await Permission.findOne({
    where: {
      permissionUid,
      projectId,
    },
  });
  if (preExistingMatch) {
    preExistingMatch.permissionRole = permissionRole;
    return preExistingMatch.save();
  }
  return Permission.create({
    permissionUid,
    projectId,
    permissionRole,
  });
};

export const attachPermissions = async (project: ProjectInstance) => {
  try {
    const permissions = await Permission.findAll({ where: { projectId: project.projectId } });
    return {
      project,
      permissions,
    };
  } catch (err) {
    throw err;
  }
};

export const attachPermissionsToProjects = (projects: ProjectInstance[]) =>
  Promise.all(projects.map(project => attachPermissions(project)));

export const findProjectPermissions = (projectId: number) => Permission.findAll({ where: { projectId } });

export const findPermissionsByUserId = (uid: string) => Permission.findAll({ where: { permissionUid: uid } });
