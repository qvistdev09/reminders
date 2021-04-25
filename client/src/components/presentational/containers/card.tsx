import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  header?: string;
  cardMax?: number;
}

export const Card = ({ children, header, flex = 0, cardMax }: Props) => {
  const style = cardMax ? { maxWidth: `${cardMax.toString()}rem`, flex } : { flex };
  return (
    <div className='containers__card' style={style}>
      {header && (
        <div className='containers__card-header'>
          <h2>{header}</h2>
        </div>
      )}
      <div className='containers__card-content'>{children}</div>
    </div>
  );
};
