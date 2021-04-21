import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';
import { Project, Permission } from '../database/root';
import { PermissionRole } from 'reminders-shared/sharedTypes';
import { AuthorizedEntry } from '../types';
import { getNameFromOkta } from '../api/services/user-service';
import { Socket } from 'socket.io';

const authenticateSocket = (authHeader: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const accessToken = extractAccessToken(authHeader);
    if (!accessToken) {
      return reject();
    }
    appJwtVerifier
      .verifyAccessToken(accessToken, aud)
      .then(jwt => {
        const { uid } = jwt.claims;
        if (typeof uid !== 'string') {
          return reject();
        }
        resolve(uid);
      })
      .catch(() => reject());
  });
};

const authorizeUser = async (uid: string, projectId: number): Promise<PermissionRole | 'Owner'> => {
  return new Promise(async (resolve, reject) => {
    try {
      const matchedProject = await Project.findOne({ where: { projectId } });
      if (!matchedProject) {
        return reject();
      }
      let permissionRole: PermissionRole | 'Owner' | null = null;
      if (matchedProject.projectOwner === uid) {
        permissionRole = 'Owner';
      } else {
        const projectPermissions = await Permission.findAll({ where: { projectId } });
        const matchedPermission = projectPermissions.find(permission => permission.permissionUid === uid);
        if (matchedPermission) {
          permissionRole = matchedPermission.permissionRole;
        }
      }
      if (!permissionRole) {
        return reject();
      }
      resolve(permissionRole);
    } catch (err) {
      reject(err);
    }
  });
};

const authenticateAndAuthorizeSocket = (
  authHeader: string,
  projectHeader: string,
  socket: Socket
): Promise<AuthorizedEntry> => {
  return new Promise(async (resolve, reject) => {
    try {
      const uid = await authenticateSocket(authHeader);
      const projectId = parseInt(projectHeader, 10);
      const permissionRole = await authorizeUser(uid, projectId);
      const userObj = await getNameFromOkta(uid);
      const newEntry = {
        userObj,
        socket,
        projectId,
        permissionRole,
      };
      resolve(newEntry);
    } catch (err) {
      reject(err);
    }
  });
};

export { authenticateAndAuthorizeSocket };
