import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToCart, fetchItemByUserId, removeItemFromCart, resetCart, updateItemById } from './cartApi';

const initialState = {
  items: [],
  status: 'idle',
  value:0
};

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (item) => {
    const response = await addToCart(item);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const fetchItemByUserIdAsync = createAsyncThunk(
  'cart/fetchItemByUserId',
  async (userId) => {
    const response = await fetchItemByUserId(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateItemById',
  async (updateId) => {
    const response = await updateItemById(updateId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItemFromCart',
  async (ItemId) => {
    const response = await removeItemFromCart(ItemId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const  resetCartAsync= createAsyncThunk(
  'cart/resetCart',
  async (userId) => {
    const response = await resetCart(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload)
      })
      .addCase(fetchItemByUserIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemByUserIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(updateCartItemAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex((item)=>item.id === action.payload.id)
        state.items[index] = action.payload;
      })
      .addCase(removeItemFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.items.findIndex((item)=>item.id === action.payload.id)
        state.items.splice(index,1);
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = [];
      })
  },
});

export const { increment } = cartSlice.actions;

export const selectCartItem = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;

export default cartSlice.reducer;