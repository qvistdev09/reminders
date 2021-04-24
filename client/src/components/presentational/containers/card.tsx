import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  header?: string;
}

export const Card = ({ children, header }: Props) => {
  return (
    <div className='containers__card'>
      {header && (
        <div className='containers__card-header'>
          <h2>{header}</h2>
        </div>
      )}
      <div className='containers__card-content'>{children}</div>
    </div>
  );
};
