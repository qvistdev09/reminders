import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { UserObj } from 'reminders-shared/sharedTypes';

interface SignUpForm {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  passwordRepeat: String;
  securityQuestion: String;
  securityAnswer: String;
}

const signUp = (userDetails: SignUpForm) =>
  axios.post(`${apiUrl}/users`, { newUser: userDetails });

const getAllAppUsers = (accesToken: string): Promise<UserObj[]> => {
  return axios
    .get(`${apiUrl}/users`, makeOptionsObj(accesToken))
    .then(response => response.data);
};

const userApi = { signUp, getAllAppUsers };

export { userApi };
