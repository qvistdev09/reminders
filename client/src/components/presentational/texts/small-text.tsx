import { ReactNode } from 'react';
import './texts.scss';

interface Props {
  children: ReactNode;
}

export const SmallText = ({ children }: Props) => {
  return <p className='texts__small-text'>{children}</p>;
};
