import { useState } from 'react';
import { userApi } from '../api-service/user';
import { useOktaAuth } from '@okta/okta-react';
import { AxiosError } from 'axios';

type SignUpField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'passwordRepeat'
  | 'securityQuestion'
  | 'securityAnswer';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface HookReturn {
  form: SignupForm;
  successfulSignup: boolean;
  errorMessage: string;
  updateForm: (value: string, field: SignUpField) => void;
  performSignup: () => void;
}

const useSignup = (): HookReturn => {
  const { oktaAuth } = useOktaAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    securityQuestion: '',
    securityAnswer: '',
  } as SignupForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successfulSignup, setSuccessfulSignup] = useState(false);

  const updateForm = (value: string, field: SignUpField) => {
    setForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const automatedLogin = async () => {
    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username: form.email,
        password: form.password,
      });
      if (transaction.status === 'SUCCESS') {
        return oktaAuth.signInWithRedirect({
          originalUri: '/',
          sessionToken: transaction.sessionToken,
        });
      }
      setErrorMessage('Login failed');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const performSignup = () => {
    if (form.password !== form.passwordRepeat) {
      return setErrorMessage('Your passwords do not match!');
    }
    userApi
      .signUp(form)
      .then(() => {
        setSuccessfulSignup(true);
        automatedLogin();
      })
      .catch((err: AxiosError) => {
        if (err.response?.data && err.response.data.error) {
          return setErrorMessage(err.response.data.error);
        }
        setErrorMessage(err.message);
      });
  };

  return {
    form,
    successfulSignup,
    errorMessage,
    updateForm,
    performSignup,
  };
};

export { useSignup };
