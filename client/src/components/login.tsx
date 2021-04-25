import { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router';
import { Flex } from './presentational/containers/flex';
import { Form } from './presentational/containers/form';
import { LabelledInput } from './presentational/inputs/labelled-input';
import { Button } from './presentational/button/button';
import { Text } from './presentational/texts/text';
import { Card } from './presentational/containers/card';

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

  const handleLogin = async () => {
    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username: formData.email,
        password: formData.password,
      });
      if (transaction.status === 'SUCCESS' && typeof transaction.sessionToken === 'string') {
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
    <Flex justify='center' flex={1} align='start'>
      <Flex maxWidth='appMaxWidth' justify='center' align='start' yPadding={0} xPadding={1}>
        <Card header='Log in' flex={1} cardMax={30}>
          <Form onSubmit={handleLogin}>
            <LabelledInput
              value={formData.email}
              onChange={(value: string) => updateForm(value, 'email')}
              label='Your email'
              id='login-email'
            />
            <LabelledInput
              value={formData.password}
              onChange={(value: string) => updateForm(value, 'password')}
              label='Your password'
              id='login-password'
              type='password'
            />
            <Button btnStyle='action' label='Log in' onClick={() => {}} />
            {errorMessage !== '' && <Text>{errorMessage}</Text>}
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
};

const Login = () => {
  const { authState } = useOktaAuth();

  if (authState.isPending) {
    return <Text>Signing in...</Text>;
  }

  return authState.isAuthenticated ? <Redirect to='/' /> : <LoginForm />;
};

export default Login;
