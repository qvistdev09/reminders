import Icon from '../icon/icon';

interface Props {
  children: React.ReactNode;
  label: string;
  close: () => void;
}

const Modal = ({ children, label, close }: Props) => {
  const closeAction = () => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = 'auto';
    }
    close();
  };

  return (
    <div className='modal'>
      <div className='modal__inner'>
        <div className='modal__header-container'>
          <h5 className='modal__label'>{label}</h5>
          <button className='modal__close-btn' onClick={closeAction}>
            <Icon icon='close' color='semiDark' size='large' />
          </button>
        </div>
        <div className='modal__content'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
