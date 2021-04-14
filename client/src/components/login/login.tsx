import { useState } from 'react';
import FormLabelledInput from '../form/elements/form-labelled-input';

type LoginField = 'email' | 'password';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const updateForm = (value: string, field: LoginField) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <form className='form'>
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
      />
      <button type='submit' className='form__submit-btn'>
        Login
      </button>
    </form>
  );
};

export default Login;
