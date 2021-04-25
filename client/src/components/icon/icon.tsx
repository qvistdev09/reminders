import IconCube from './elements/icon-cube';
import IconChevronForward from './elements/icon-chevron-forward';
import IconChevronDown from './elements/icon-chevron-down';
import IconGrid from './elements/icon-grid';
import IconOpen from './elements/icon-open';
import IconClose from './elements/icon-close';
import IconAddOutline from './elements/icon-add-outline';
import IconShared from './elements/icon-shared';
import { IconTrash } from './elements/icon-trash';
import { IconPencil } from './elements/icon-pencil';
import { IconCheck } from './elements/icon-check';
import { IconHeart } from './elements/icon-heart';
import './icon.scss';

const icons = {
  cube: IconCube,
  chevronForward: IconChevronForward,
  chevronDown: IconChevronDown,
  grid: IconGrid,
  open: IconOpen,
  close: IconClose,
  addOutline: IconAddOutline,
  shared: IconShared,
  trash: IconTrash,
  pencil: IconPencil,
  check: IconCheck,
  heart: IconHeart,
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
  primary: 'icon--primary',
};

interface Props {
  icon?:
    | 'cube'
    | 'chevronForward'
    | 'chevronDown'
    | 'grid'
    | 'open'
    | 'close'
    | 'addOutline'
    | 'shared'
    | 'trash'
    | 'pencil'
    | 'check'
    | 'heart';
  size?: 'tiny' | 'small' | 'medium' | 'large';
  color?: 'white' | 'semiDark' | 'primary';
  padding?: number;
}

const Icon = ({ icon = 'cube', size = 'small', color = 'white', padding = 0 }: Props) => (
  <div>
    <div className={`icon ${sizes[size]} ${colors[color]}`} style={{ margin: `${padding.toString()}rem` }}>
      {icons[icon]()}
    </div>
  </div>
);

export default Icon;
