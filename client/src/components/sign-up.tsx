import { useSignup } from '../hooks/use-signup';
import { Card } from './presentational/containers/card';
import { Flex } from './presentational/containers/flex';
import { Form } from './presentational/containers/form';
import { LabelledInput } from './presentational/inputs/labelled-input';
import { Button } from './presentational/button/button';
import { Text } from './presentational/texts/text';

const SignUp = () => {
  const { form, successfulSignup, errorMessage, updateForm, performSignup } = useSignup();

  if (successfulSignup) {
    return <Text>You successfully signed up! Please wait while you are being logged in.</Text>;
  }

  return (
    <Flex justify='center' flex={1} align='start'>
      <Flex maxWidth='appMaxWidth' justify='center' align='start' yPadding={0} xPadding={1}>
        <Card header='Sign up' flex={1} cardMax={30}>
          <Form onSubmit={performSignup}>
            <LabelledInput
              value={form.firstName}
              onChange={(value: string) => updateForm(value, 'firstName')}
              label='First name'
              id='first-name'
            />
            <LabelledInput
              value={form.lastName}
              onChange={(value: string) => updateForm(value, 'lastName')}
              label='Last name'
              id='last-name'
            />
            <LabelledInput
              value={form.email}
              onChange={(value: string) => updateForm(value, 'email')}
              label='Email'
              id='email'
              type='email'
            />
            <LabelledInput
              value={form.password}
              onChange={(value: string) => updateForm(value, 'password')}
              label='Password'
              id='password'
              type='password'
            />
            <LabelledInput
              value={form.passwordRepeat}
              onChange={(value: string) => updateForm(value, 'passwordRepeat')}
              label='Repeat your password'
              id='password-repeat'
              type='password'
            />
            <LabelledInput
              value={form.securityQuestion}
              onChange={(value: string) => updateForm(value, 'securityQuestion')}
              label='Security question'
              id='security-question'
              type='text'
            />
            <LabelledInput
              value={form.securityAnswer}
              onChange={(value: string) => updateForm(value, 'securityAnswer')}
              label='Security question answer'
              id='security-answer'
              type='text'
            />
            <Button btnStyle='action' label='Sign up' onClick={() => {}} />
            {errorMessage !== '' && <Text>{errorMessage}</Text>}
          </Form>
        </Card>
      </Flex>
    </Flex>
  );
};

export default SignUp;
