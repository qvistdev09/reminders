import IconCube from './elements/icon-cube';
import IconChevronForward from './elements/icon-chevron-forward';

const icons = {
  cube: IconCube,
  chevronForward: IconChevronForward,
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
  icon?: 'cube' | 'chevronForward';
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
