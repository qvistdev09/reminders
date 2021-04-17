import { oktaAxios } from './okta-axios';
import { ClientUserProfile } from '../validation/sign-up-validation';

// types
import { UserObj } from '../../types';

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

const postUserToOkta = (userDetails: ClientUserProfile) => {
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

const getNameFromOkta = (uid: string): Promise<UserObj> => {
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

const getAllAppUsers = (): Promise<UserObj[]> => {
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

export { postUserToOkta, getNameFromOkta, getAllAppUsers };
