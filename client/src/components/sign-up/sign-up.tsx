import { SyntheticEvent } from 'react';
import FormLabelledInput from '../form/elements/form-labelled-input';
import { useSignup } from '../../hooks/use-signup';

const SignUp = () => {
  const { form, successfulSignup, errorMessage, updateForm, performSignup } = useSignup();

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    performSignup();
  };

  if (successfulSignup) {
    return <p>You successfully signed up! Please wait while you are being logged in.</p>;
  }

  return (
    <div className='main__signup-container'>
      <form className='form utility--darkened-column' onSubmit={handleFormSubmit}>
        <FormLabelledInput
          value={form.firstName}
          onChange={(value: string) => updateForm(value, 'firstName')}
          label='First name'
          id='first-name'
        />
        <FormLabelledInput
          value={form.lastName}
          onChange={(value: string) => updateForm(value, 'lastName')}
          label='Last name'
          id='last-name'
        />
        <FormLabelledInput
          value={form.email}
          onChange={(value: string) => updateForm(value, 'email')}
          label='Email'
          id='email'
          type='email'
        />
        <FormLabelledInput
          value={form.password}
          onChange={(value: string) => updateForm(value, 'password')}
          label='Password'
          id='password'
          type='password'
        />
        <FormLabelledInput
          value={form.passwordRepeat}
          onChange={(value: string) => updateForm(value, 'passwordRepeat')}
          label='Repeat your password'
          id='password-repeat'
          type='password'
        />
        <FormLabelledInput
          value={form.securityQuestion}
          onChange={(value: string) => updateForm(value, 'securityQuestion')}
          label='Security question'
          id='security-question'
          type='text'
        />
        <FormLabelledInput
          value={form.securityAnswer}
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
    </div>
  );
};

export default SignUp;
