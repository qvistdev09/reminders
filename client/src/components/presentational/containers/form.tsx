import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  onSubmit: () => void;
}

export const Form = ({ children, onSubmit }: Props) => {
  return (
    <form className='containers__form' onSubmit={() => onSubmit()}>
      {children}
    </form>
  );
};
