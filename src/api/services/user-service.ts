import { oktaAxios } from './okta-axios';
import { ClientUserProfile } from '../validation-schemas/sign-up-validation';
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

export { postUserToOkta, ClientUserProfile };