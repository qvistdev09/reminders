import './inputs.scss';

import { SyntheticEvent } from 'react';

interface Props {
  value: string;
  onChange: (str: string) => void;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search';
  label: string;
  id: string;
  placeholder?: string;
}

export const LabelledInput = ({
  value,
  onChange,
  required = true,
  type = 'text',
  label,
  id,
  placeholder = '',
}: Props) => (
  <label htmlFor={id} className='inputs__label'>
    <span>{label}</span>
    <input
      value={value}
      onChange={(e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        onChange(target.value);
      }}
      type={type}
      required={required}
      id={id}
      placeholder={placeholder}
      className='inputs__text-input'
    />
  </label>
);
