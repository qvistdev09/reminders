import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';
import { ContainerRow } from './containers-props';
import './containers.scss';

const Row = ({ children, bg, justify, expand, minHeight, borders = [] }: ContainerRow) => {
  const baseClass = `containers__row-${justify}`;
  const bgModifier = getModifier('containers', bg);
  const expandModifier = expand ? getModifier('containers', 'expand') : '';
  const minHeightModifier = getModifier('containers', minHeight);

  const borderClasses = borders.map(border => getModifier('containers', `border-${border}`));

  return (
    <div
      className={makeClassname(baseClass, bgModifier, expandModifier, minHeightModifier, ...borderClasses)}
    >
      {children}
    </div>
  );
};

export { Row };
