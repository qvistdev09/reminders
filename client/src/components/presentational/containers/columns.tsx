import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  columns: number[];
  gap?: number;
}

export const Columns = ({
  children,
  columns = [1],
  yPadding = '0rem',
  xPadding = '0rem',
  gap = 0,
}: Props) => {
  const gridTemplateColumns = columns.map(col => `${col.toString()}fr`).join(' ');
  const padding = `${yPadding} ${xPadding}`;
  const columnGap = `${gap.toString()}rem`;
  return (
    <div className='containers__columns' style={{ gridTemplateColumns, padding, columnGap }}>
      {children}
    </div>
  );
};
