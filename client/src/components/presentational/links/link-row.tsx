import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './links.scss';

interface Props {
  to: string;
  children: ReactNode;
}

export const LinkRow = ({ to, children }: Props) => {
  return (
    <Link to={to} className='links__row'>
      {children}
    </Link>
  );
};
