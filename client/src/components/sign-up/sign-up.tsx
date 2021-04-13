import { useState } from 'react';
import FormLabelledInput from '../form/elements/form-labelled-input';

type SignUpField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'passwordRepeat'
  | 'securityQuestion'
  | 'securityAnswer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const updateForm = (value: string, field: SignUpField) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <form className='form'>
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
      <button type='submit'>Sign up</button>
    </form>
  );
};

export default SignUp;
