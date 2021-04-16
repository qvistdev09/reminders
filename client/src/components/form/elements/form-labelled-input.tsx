import { SyntheticEvent } from 'react';

interface Props {
  value: string;
  onChange: (str: string) => void;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search';
  label: string;
  id: string;
}

const FormLabelledInput = ({ value, onChange, required = true, type = 'text', label, id }: Props) => (
  <>
    <label htmlFor={id} className='form__label'>
      {label}
    </label>
    <input
      value={value}
      onChange={(e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        onChange(target.value);
      }}
      type={type}
      required={required}
      id={id}
      className='form__input'
    />
  </>
);

export default FormLabelledInput;
