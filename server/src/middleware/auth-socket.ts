import appJwtVerifier, { aud } from '../config/okta-config';
import { extractAccessToken } from '../modules/auth-functions';
import { Project, Permission } from '../database/root';
import { PermissionRole } from 'reminders-shared/sharedTypes';
import { AuthedSocketObj } from '../types';
import { getNameFromOkta } from '../api/services/user-service';
import { Socket } from 'socket.io';

const authenticateSocket = (authHeader: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const accessToken = extractAccessToken(authHeader);
    if (!accessToken) {
      return reject('nah');
    }
    appJwtVerifier
      .verifyAccessToken(accessToken, aud)
      .then(jwt => resolve(jwt))
      .catch(() => reject());
  });
};

const authorizeSocket = async (uid: string, projectId: number, socket: Socket): Promise<AuthedSocketObj> => {
  return new Promise(async (resolve, reject) => {
    try {
      const matchedProject = await Project.findOne({ where: { projectId } });
      if (!matchedProject) {
        return reject();
      }
      let permissionRole: PermissionRole | 'Owner' | '' = '';
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
      const userDetails = await getNameFromOkta(uid);
      const authedSocket: AuthedSocketObj = {
        ...userDetails,
        permissionRole,
        socket,
        projectId,
      };
      resolve(authedSocket);
    } catch (err) {
      reject(err);
    }
  });
};

const authenticateAndAuthorizeSocket = (
  authHeader: string,
  projectHeader: string,
  socket: Socket
): Promise<AuthedSocketObj> => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientJwt = await authenticateSocket(authHeader);
      const { uid } = clientJwt.claims;
      if (!uid || typeof uid !== 'string') {
        return reject();
      }
      const projectId = parseInt(projectHeader, 10);
      const authedSocketObj = await authorizeSocket(uid, projectId, socket);
      resolve(authedSocketObj);
    } catch (err) {
      reject(err);
    }
  });
};

export { authenticateAndAuthorizeSocket };
