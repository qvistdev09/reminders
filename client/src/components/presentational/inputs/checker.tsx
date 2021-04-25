import Icon from '../icon/icon';

interface Props {
  checked: boolean;
  onClick: () => void;
}

export const Checker = ({ checked, onClick }: Props) => {
  return (
    <button onClick={() => onClick()} className='inputs__checker'>
      {checked && <Icon icon='check' color='primary' size='medium' />}
    </button>
  );
};
