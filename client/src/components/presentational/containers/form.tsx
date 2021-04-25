import { SyntheticEvent } from 'react';
import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  onSubmit: () => void;
  onBlur?: () => void;
}

export const Form = ({ children, onSubmit, onBlur }: Props) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleBlur = (e: SyntheticEvent) => {
    e.preventDefault();
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <form className='containers__form' onSubmit={handleSubmit} onBlur={handleBlur}>
      {children}
    </form>
  );
};
