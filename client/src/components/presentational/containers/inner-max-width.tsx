import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';
import { ContainerBase } from './containers-props';
import './containers.scss';

export const InnerMaxWidth = ({
  children,
  bg,
  isNav,
  xPadding = '0rem',
  yPadding = '0rem',
}: ContainerBase) => {
  const baseClass = 'containers__inner-max-width';
  const bgModifier = getModifier('containers', bg);
  const style = {
    padding: `${yPadding} ${xPadding}`,
  };
  return isNav ? (
    <nav className={makeClassname(baseClass, bgModifier)} style={style}>
      {children}
    </nav>
  ) : (
    <div className={makeClassname(baseClass, bgModifier)} style={style}>
      {children}
    </div>
  );
};
