import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchLoggedinUserOrders } from './userAPI';

const initialState = {
  userOrders:[],
  status: 'idle',
};

export const fetchUserOrdersAsync = createAsyncThunk(
  'user/fetchLoggedinUserOrders',
  async (userId) => {
    const response = await fetchLoggedinUserOrders(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const counterSlice = createSlice({
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
      .addCase(fetchUserOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrdersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userOrders = action.payload;
      });
  },
});

export const { increment } = counterSlice.actions;

export const selectUserOrders = (state) => state.user.userOrders;

export default counterSlice.reducer;
