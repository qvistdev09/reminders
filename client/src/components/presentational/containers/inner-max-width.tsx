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
  align = 'center',
}: ContainerBase) => {
  const baseClass = 'containers__inner-max-width';
  const bgModifier = getModifier('containers', bg);
  const style = {
    padding: `${yPadding} ${xPadding}`,
  };
  const alignClass = getModifier('containers', `align-${align}`);
  const className = makeClassname(baseClass, bgModifier, alignClass);
  return isNav ? (
    <nav className={className} style={style}>
      {children}
    </nav>
  ) : (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
