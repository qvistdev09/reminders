import { SyntheticEvent } from 'react';
import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  onSubmit: () => void;
}

export const Form = ({ children, onSubmit }: Props) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className='containers__form' onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
