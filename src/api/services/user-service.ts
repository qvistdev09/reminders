import { oktaAxios } from './okta-axios';
import { ClientUserProfile } from '../validation-schemas/sign-up-validation';

// types
import { NameObj } from '../../shared-types';

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

const getNameFromOkta = (uid: string): Promise<NameObj> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetailsFromOkta = await oktaAxios.get(`users/${uid}`);
      const {
        data: { profile },
      } = userDetailsFromOkta;
      resolve({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    } catch (err) {
      reject(err);
    }
  });
};

export { postUserToOkta, getNameFromOkta };
