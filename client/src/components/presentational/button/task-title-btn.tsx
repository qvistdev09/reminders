import './button.scss';
import Icon from '../../icon/icon';
import { Text } from '../texts/text';

interface Props {
  onClick: () => void;
  label: string;
}

export const TaskTitleBtn = ({ onClick, label }: Props) => {
  return (
    <button onClick={() => onClick()} className='button__task-title'>
      <Icon icon='pencil' color='semiDark' size='small' />
      <Text size='normal' weight='strong'>
        {label}
      </Text>
    </button>
  );
};
