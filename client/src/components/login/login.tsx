import { SyntheticEvent, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import FormLabelledInput from '../form/elements/form-labelled-input';
import { Redirect } from 'react-router';

type LoginField = 'email' | 'password';

const LoginForm = () => {
  const { oktaAuth } = useOktaAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionToken, setSessionToken] = useState('');

  const updateForm = (value: string, field: LoginField) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username: formData.email,
        password: formData.password,
      });
      if (
        transaction.status === 'SUCCESS' &&
        typeof transaction.sessionToken === 'string'
      ) {
        setSessionToken(transaction.sessionToken);
        oktaAuth.signInWithRedirect({
          sessionToken: transaction.sessionToken,
        });
      } else {
        setErrorMessage('Failed to login');
      }
    } catch (err) {
      setErrorMessage('Failed to login');
    }
  };

  if (sessionToken) {
    return null;
  }

  return (
    <div className='main__login-container'>
      <form className='form utility--darkened-column' onSubmit={handleLogin}>
        <FormLabelledInput
          value={formData.email}
          onChange={(value: string) => updateForm(value, 'email')}
          label='Your email'
          id='login-email'
        />
        <FormLabelledInput
          value={formData.password}
          onChange={(value: string) => updateForm(value, 'password')}
          label='Your password'
          id='login-password'
          type='password'
        />
        <button type='submit' className='form__submit-btn'>
          Login
        </button>
        {errorMessage !== '' && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

const Login = () => {
  const { authState } = useOktaAuth();

  if (authState.isPending) {
    return <p>Signing in...</p>;
  }

  return authState.isAuthenticated ? <Redirect to='/' /> : <LoginForm />;
};

export default Login;
