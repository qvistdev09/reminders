import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface ModalState {
  activeModal: string | null;
}

const initialState: ModalState = {
  activeModal: null,
};

const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<string>) => {
      const activeModal = action.payload;
      state.activeModal = activeModal;
    },
  },
});

export const { setModal } = modal.actions;

export const getActiveModal = (state: RootState) => state.modal.activeModal;

export default modal.reducer;
