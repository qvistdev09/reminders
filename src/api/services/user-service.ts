import axios from 'axios';

const oktaToken = process.env.OKTA_TOKEN as string;

if (!oktaToken) {
  console.error('Missing Okta token in environment variables');
}

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `SSWS ${oktaToken}`,
};

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
}

const createUser = (userDetails: OktaUserProfile) => {
  
};
