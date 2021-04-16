import { Permission } from '../../database/root';
import { ProjectInstance } from '../../database/schemas/project';
import { PermissionInstance } from '../../database/schemas/permission';
import { getNameFromOkta } from './user-service';

// types
import { NameObj } from '../../shared-types';

export interface PermissionInstanceWithName {
  userPermission: PermissionInstance;
  userProfile: NameObj;
}

export interface ProjectWithPermissions {
  project: ProjectInstance;
  projectPermissions: PermissionInstanceWithName[];
}

const appendNameToPermission = (
  userPermission: PermissionInstance
): Promise<PermissionInstanceWithName> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userProfile = await getNameFromOkta(userPermission.permissionUid);
      resolve({
        userPermission,
        userProfile,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const appendPermissionsToProject = (
  project: ProjectInstance
): Promise<ProjectWithPermissions> => {
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
        project,
        projectPermissions,
      });
    } catch (err) {
      reject(err);
    }
  });
};

export { appendPermissionsToProject };
