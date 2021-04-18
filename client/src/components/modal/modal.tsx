import Icon from '../icon/icon';

interface Props {
  children: React.ReactNode;
  label: string;
  close: () => void;
}

const Modal = ({ children, label, close }: Props) => {

  return (
    <div className='modal'>
      <div className='modal__inner'>
        <div className='modal__header-container'>
          <h5 className='modal__label'>{label}</h5>
          <button className='modal__close-btn' onClick={() => close()}>
            <Icon icon='close' color='semiDark' size='large' />
          </button>
        </div>
        <div className='modal__content'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
