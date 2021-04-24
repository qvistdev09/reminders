import { ReactNode } from 'react';

type Border = 'top' | 'bottom' | 'left' | 'right';

export interface ContainerBase {
  children: ReactNode;
  bg?: 'brightBg' | 'darkenedBg';
  flex?: number;
  isNav?: boolean;
  minHeight?: 'header';
  maxWidth?: 'appMaxWidth';
  xPadding?: number;
  yPadding?: number;
  borders?: Border[];
  align?: 'start' | 'center' | 'stretch';
  direction?: 'row' | 'column';
  childrenGap?: 'small' | 'big' | 'none';
  justify?: 'between' | 'start' | 'end' | 'center';
}
