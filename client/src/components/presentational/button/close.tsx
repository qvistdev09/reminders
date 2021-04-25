import Icon from '../../icon/icon';

interface Props {
  close: () => void;
}

export const Close = ({ close }: Props) => {
  return (
    <button className='button__close-btn' onClick={() => close()}>
      <Icon icon='close' color='semiDark' size='large' />
    </button>
  );
};
