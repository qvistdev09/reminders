import { Permission } from '../../database/root';
import { ProjectInstance } from '../../database/schemas/project';
import { PermissionInstance } from '../../database/schemas/permission';
import { getNameFromOkta } from './user-service';
import { PermissionRole, ProjectObject, UserInPermissionsGrid } from '../../types/index';

// types
import { UserObj } from '../../types';

export interface PermissionInstanceWithName {
  userPermission: PermissionInstance;
  userProfile: UserObj;
}

export interface ProjectWithPermissions {
  project: ProjectInstance;
  projectPermissions: PermissionInstanceWithName[];
}

const appendNameToPermission = (userPermission: PermissionInstance): Promise<UserInPermissionsGrid> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userProfile = await getNameFromOkta(userPermission.permissionUid);
      resolve({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        uid: userProfile.uid,
        email: userProfile.email,
        permissionRole: userPermission.permissionRole,
      });
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
      });
      const projectPermissions = await Promise.all(
        rawPermissions.map(permission => appendNameToPermission(permission))
      );
      resolve({
        projectTitle: project.projectTitle,
        projectId: project.projectId as number,
        permissions: projectPermissions,
      });
    } catch (err) {
      reject(err);
    }
  });
};

// need for try catch block?
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
    if (permissionRole === 'delete') {
      return preExistingMatch.destroy();
    }
    preExistingMatch.permissionRole = permissionRole;
    return preExistingMatch.save();
  }
  if (permissionRole !== 'delete') {
    return Permission.create({
      permissionUid,
      projectId,
      permissionRole,
    });
  }
  return null;
};

export { appendPermissionsToProject, handlePermissionChange };
