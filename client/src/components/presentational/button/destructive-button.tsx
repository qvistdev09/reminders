import { ReactNode } from 'react';

interface Props {
  onClick: () => void;
  label: string;
  icon?: ReactNode;
  dontStretch?: boolean;
}

export const DestructiveButton = ({ onClick, label, icon = <></>, dontStretch }: Props) => {
  const baseClass = 'button__destructive';
  const modifier = 'button__destructive--dontstretch';

  const className = dontStretch ? `${baseClass} ${modifier}` : baseClass;

  return (
    <button onClick={() => onClick()} className={className}>
      {icon}
      {label}
    </button>
  );
};
