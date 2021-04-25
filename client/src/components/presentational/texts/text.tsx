import { ReactNode } from 'react';
import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';
import './texts.scss';

interface Props {
  children: ReactNode;
  mood?: 'warning';
  size?: 'small' | 'normal';
  weight?: 'thin' | 'normal' | 'strong';
  dontWrap?: 'dontWrap';
}

export const Text = ({ children, mood, size = 'small', weight = 'thin', dontWrap }: Props) => {
  const baseClass = 'texts__text';
  const moodModifier = getModifier('texts', mood);
  const sizeModifier = getModifier('texts', size, 'size');
  const weightModifier = getModifier('texts', weight, 'weight');
  const wrapModifier = getModifier('texts', dontWrap);
  const className = makeClassname(baseClass, moodModifier, sizeModifier, weightModifier, wrapModifier);
  return <p className={className}>{children}</p>;
};
