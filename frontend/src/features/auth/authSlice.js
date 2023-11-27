import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser } from './authAPI';

const initialState = {
  loggedInUser: null,
  status: 'idle',
  error:null
};

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser= action.payload;
      });
  },
});


export const selectCount = (state) => state.counter.value;
export const selectLoggedInUser = (state)=>state.auth.loggedInUser;
export default authSlice.reducer;
