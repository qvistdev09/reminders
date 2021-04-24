import { ReactNode } from 'react';

type Border = 'top' | 'bottom' | 'left' | 'right';

export interface ContainerBase {
  children: ReactNode;
  bg?: 'brightBg' | 'darkenedBg';
  expand?: boolean;
  isNav?: boolean;
  minHeight?: 'header';
  xPadding?: string;
  yPadding?: string;
  borders?: Border[];
}

export interface ContainerRow extends ContainerBase {
  justify: 'start' | 'centered';
}
