import { apiUrl } from './api-url';
import axios from 'axios';

interface SignUpForm {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  passwordRepeat: String;
  securityQuestion: String;
  securityAnswer: String;
}

const signUp = (userDetails: SignUpForm) => axios.post(`${apiUrl}/users`, userDetails);

const userApi = { signUp };

export { userApi };
