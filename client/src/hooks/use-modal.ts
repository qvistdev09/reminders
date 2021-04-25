import { getActiveModal, modalReducer } from '../reducers/slices/modal';
import { useAppDispatch, useAppSelector } from './redux-hooks';

export const useModal = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector(getActiveModal);

  const setModal = (newModal: string) => {
    dispatch(modalReducer.setModal(newModal));
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    dispatch(modalReducer.setModal(null));
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = 'auto';
    }
  };

  return {
    activeModal,
    setModal,
    closeModal,
  };
};
