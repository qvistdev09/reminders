import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../form/elements/form-labelled-input';

// api service
import { userApi } from '../../api-service/user';
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

const SignUp = () => {
  const { oktaAuth } = useOktaAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const updateForm = (value: string, field: SignUpField) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const automatedLogin = async (username: string, password: string) => {
    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username,
        password,
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

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordRepeat) {
      return setErrorMessage('Your passwords do not match!');
    }
    userApi
      .signUp(formData)
      .then(() => {
        console.log('User created success');
        automatedLogin(formData.email, formData.password);
      })
      .catch((err: AxiosError) => {
        if (err.response?.data && err.response.data.error) {
          return setErrorMessage(err.response.data.error);
        }
        setErrorMessage(err.message);
      });
  };

  return (
    <form className='form' onSubmit={handleFormSubmit}>
      <FormLabelledInput
        value={formData.firstName}
        onChange={(value: string) => updateForm(value, 'firstName')}
        label='First name'
        id='first-name'
      />
      <FormLabelledInput
        value={formData.lastName}
        onChange={(value: string) => updateForm(value, 'lastName')}
        label='Last name'
        id='last-name'
      />
      <FormLabelledInput
        value={formData.email}
        onChange={(value: string) => updateForm(value, 'email')}
        label='Email'
        id='email'
        type='email'
      />
      <FormLabelledInput
        value={formData.password}
        onChange={(value: string) => updateForm(value, 'password')}
        label='Password'
        id='password'
        type='password'
      />
      <FormLabelledInput
        value={formData.passwordRepeat}
        onChange={(value: string) => updateForm(value, 'passwordRepeat')}
        label='Repeat your password'
        id='password-repeat'
        type='password'
      />
      <FormLabelledInput
        value={formData.securityQuestion}
        onChange={(value: string) => updateForm(value, 'securityQuestion')}
        label='Security question'
        id='security-question'
        type='text'
      />
      <FormLabelledInput
        value={formData.securityAnswer}
        onChange={(value: string) => updateForm(value, 'securityAnswer')}
        label='Security question answer'
        id='security-answer'
        type='text'
      />
      <button type='submit' className='form__submit-btn'>
        Sign up
      </button>
      {errorMessage !== '' && <p>{errorMessage}</p>}
    </form>
  );
};

export default SignUp;
