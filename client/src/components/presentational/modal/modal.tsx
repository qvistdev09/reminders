import Icon from '../../icon/icon';
import { Close } from '../button/close';
import './modal.scss';

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
          <Close close={close} />
        </div>
        <div className='modal__content'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
