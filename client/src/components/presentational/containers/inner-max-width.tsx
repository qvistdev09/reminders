import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';
import { ContainerBase } from './containers-props';
import './containers.scss';

export const InnerMaxWidth = ({ children, bg, isNav }: ContainerBase) => {
  const baseClass = 'containers__inner-max-width';
  const bgModifier = getModifier('containers', bg);
  return isNav ? (
    <nav className={makeClassname(baseClass, bgModifier)}>{children}</nav>
  ) : (
    <div className={makeClassname(baseClass, bgModifier)}>{children}</div>
  );
};
