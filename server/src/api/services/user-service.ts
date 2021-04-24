import { oktaAxios } from './okta-axios';
import { ClientUserProfile } from '../validation/sign-up-validation';
import { UserInPermissionsGrid, UserObj } from 'reminders-shared/sharedTypes';
import { PermissionInstance } from '../../database/schemas/permission';
import { ProjectInstance } from '../../database/schemas/project';

const oktaGroup = process.env.OKTA_GROUP as string;

interface OktaUserProfile {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    login: string;
  };
  credentials: {
    recovery_question: {
      question: string;
      answer: string;
    };
    password: string;
  };
  groupIds: [string];
}

export const postUserToOkta = (userDetails: ClientUserProfile) => {
  if (!oktaGroup) {
    throw new Error('Missing Okta group, cannot create user');
  }
  const newUser: OktaUserProfile = {
    profile: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      login: userDetails.email,
    },
    credentials: {
      recovery_question: {
        question: userDetails.securityQuestion,
        answer: userDetails.securityAnswer,
      },
      password: userDetails.password,
    },
    groupIds: [oktaGroup],
  };
  return oktaAxios.post('users', newUser);
};

export const getNameFromOkta = (uid: string): Promise<UserObj> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetailsFromOkta = await oktaAxios.get(`users/${uid}`);
      const {
        data: { id, profile },
      } = userDetailsFromOkta;
      resolve({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        uid: id,
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllAppUsers = (): Promise<UserObj[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const oktaUserObjects = await oktaAxios.get(`groups/${oktaGroup}/users`);
      const userObjects = oktaUserObjects.data.map((oktaUserObj: any) => ({
        firstName: oktaUserObj.profile.firstName,
        lastName: oktaUserObj.profile.lastName,
        email: oktaUserObj.profile.email,
        uid: oktaUserObj.id,
      }));
      resolve(userObjects);
    } catch (err) {
      reject(err);
    }
  });
};

export const userIsDefined = (user: UserInPermissionsGrid | undefined): user is UserInPermissionsGrid => {
  return user !== undefined;
};

export const appendNamesToPermissions = (
  permissions: PermissionInstance[],
  usersCatalog: UserObj[]
): UserInPermissionsGrid[] => {
  return usersCatalog
    .map(user => {
      const match = permissions.find(permission => permission.permissionUid === user.uid);
      if (match) {
        const preparedObject: UserInPermissionsGrid = {
          ...user,
          permissionRole: match.permissionRole,
        };
        return preparedObject;
      }
      return undefined;
    })
    .filter(userIsDefined);
};

export const appendNamesToManyProjects = async (
  projects: { project: ProjectInstance; permissions: PermissionInstance[] }[],
  catalog?: UserObj[]
) => {
  try {
    const allUsers = catalog ? catalog : await getAllAppUsers();
    return projects.map(({ project, permissions }) => {
      return {
        project,
        permissions: appendNamesToPermissions(permissions, allUsers),
      };
    });
  } catch (err) {
    throw err;
  }
};
