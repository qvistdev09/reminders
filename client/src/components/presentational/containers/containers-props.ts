import { ReactNode } from 'react';

export interface ContainerBase {
  children: ReactNode;
  bg?: 'brightBg' | 'darkenedBg';
  expand?: boolean;
  isNav?: boolean;
  minHeight?: 'header';
}

export interface ContainerRow extends ContainerBase {
  justify: 'start' | 'centered';
}
