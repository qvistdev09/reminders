import IconCube from './elements/icon-cube';

const icons = {
  cube: IconCube,
};

const sizes = {
  small: 'icon--small',
  medium: 'icon--medium',
  large: 'icon--large',
};

const colors = {
  white: 'icon--white',
};

interface Props {
  icon?: 'cube';
  size?: 'small' | 'medium' | 'large';
  color?: 'white';
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
