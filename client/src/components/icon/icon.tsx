import IconCube from './elements/icon-cube';
import IconChevronForward from './elements/icon-chevron-forward';
import IconChevronDown from './elements/icon-chevron-down';
import IconGrid from './elements/icon-grid';
import IconOpen from './elements/icon-open';

const icons = {
  cube: IconCube,
  chevronForward: IconChevronForward,
  chevronDown: IconChevronDown,
  grid: IconGrid,
  open: IconOpen,
};

const sizes = {
  tiny: 'icon--tiny',
  small: 'icon--small',
  medium: 'icon--medium',
  large: 'icon--large',
};

const colors = {
  white: 'icon--white',
  semiDark: 'icon--semi-dark',
};

interface Props {
  icon?: 'cube' | 'chevronForward' | 'chevronDown' | 'grid' | 'open';
  size?: 'tiny' | 'small' | 'medium' | 'large';
  color?: 'white' | 'semiDark';
  padding?: number;
}

const Icon = ({ icon = 'cube', size = 'small', color = 'white', padding = 0 }: Props) => (
  <div>
    <div
      className={`icon ${sizes[size]} ${colors[color]}`}
      style={{ margin: `${padding.toString()}rem` }}
    >
      {icons[icon]()}
    </div>
  </div>
);

export default Icon;
