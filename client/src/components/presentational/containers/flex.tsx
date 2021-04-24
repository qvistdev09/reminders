import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';
import { ContainerBase } from './containers-props';
import './containers.scss';

export const Flex = ({
  children,
  direction = 'row',
  bg,
  flex = 1,
  minHeight,
  maxWidth,
  align = 'center',
  borders = [],
  childrenGap = 'none',
  yPadding = 0,
  xPadding = 0,
  justify = 'start',
  isNav,
}: ContainerBase) => {
  const baseClass = `containers__flex-${direction}`;
  const bgModifier = getModifier('containers', bg);
  const minHeightModifier = getModifier('containers', minHeight);
  const maxWidthModifier = getModifier('containers', maxWidth);
  const alignClass = getModifier('containers', `align-${align}`);
  const justifyClass = getModifier('containers', `justify-${justify}`);
  const borderClasses = borders.map(border => getModifier('containers', `border-${border}`));
  const childrenGapModifier = getModifier('containers', `gap-${childrenGap}`);

  const className = makeClassname(
    baseClass,
    bgModifier,
    minHeightModifier,
    alignClass,
    ...borderClasses,
    childrenGapModifier,
    justifyClass,
    maxWidthModifier
  );

  const padding = `${yPadding.toString()}rem ${xPadding.toString()}rem`;

  return isNav ? (
    <nav className={className} style={{ flex, padding }}>
      {children}
    </nav>
  ) : (
    <div className={className} style={{ flex, padding }}>
      {children}
    </div>
  );
};
