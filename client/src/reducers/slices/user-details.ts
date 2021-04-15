import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface UserDetailsState {
  firstName: string;
  lastName: string;
  retrieved: boolean;
}

interface NameData {
  firstName: string;
  lastName: string;
}

const initialState: UserDetailsState = {
  firstName: '',
  lastName: '',
  retrieved: false,
};

const userDetails = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<NameData>) => {
      const { firstName, lastName } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.retrieved = true;
    },
  },
});

export const { setName } = userDetails.actions;

export const getUserDetails = (state: RootState) => state.userDetails;

export default userDetails.reducer;
