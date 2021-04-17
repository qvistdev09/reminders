import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface UserDetailsState {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  retrieved: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}

const initialState: UserDetailsState = {
  firstName: '',
  lastName: '',
  email: '',
  uid: '',
  retrieved: false,
};

const userDetails = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setDetails: (state, action: PayloadAction<UserData>) => {
      const { firstName, lastName, email, uid } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.uid = uid;
      state.retrieved = true;
    },
  },
});

export const { setDetails } = userDetails.actions;

export const getUserDetails = (state: RootState) => state.userDetails;

export default userDetails.reducer;
