import { Permission } from '../../database/root';
import { PermissionInstance } from '../../database/schemas/permission';
import { ProjectInstance } from '../../database/schemas/project';
import { PermissionRole, ProjectObject, UserInPermissionsGrid, UserObj } from 'reminders-shared/sharedTypes';
import { getAllAppUsers } from './user-service';

export interface PermissionInstanceWithName {
  userPermission: PermissionInstance;
  userProfile: UserObj;
}

export interface ProjectWithPermissions {
  project: ProjectInstance;
  projectPermissions: PermissionInstanceWithName[];
}

const userIsDefined = (user: UserInPermissionsGrid | undefined): user is UserInPermissionsGrid => {
  return user !== undefined;
};

const appendNames = (permissions: PermissionInstance[]): Promise<UserInPermissionsGrid[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await getAllAppUsers();
      const usersInProject = allUsers.map(user => {
        const match = permissions.find(permission => permission.permissionUid === user.uid);
        if (match) {
          const preparedObject: UserInPermissionsGrid = {
            ...user,
            permissionRole: match.permissionRole,
          };
          return preparedObject;
        }
        return undefined;
      });
      const noNulls = usersInProject.filter(userIsDefined);
      resolve(noNulls);
    } catch (err) {
      reject(err);
    }
  });
};

const appendPermissionsToProject = (project: ProjectInstance): Promise<ProjectObject> => {
  return new Promise(async (resolve, reject) => {
    try {
      const rawPermissions = await Permission.findAll({
        where: {
          projectId: project.projectId,
        },
        order: [['createdAt', 'ASC']],
      });
      const projectPermissions = await appendNames(rawPermissions);
      resolve({
        projectTitle: project.projectTitle,
        projectId: project.projectId as number,
        permissions: projectPermissions,
        projectVisibility: project.projectVisibility,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const handlePermissionChange = async (
  permissionUid: string,
  projectId: number,
  permissionRole: PermissionRole | 'Owner'
) => {
  if (permissionRole === 'Owner') {
    return null;
  }
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

export { appendPermissionsToProject, handlePermissionChange };
