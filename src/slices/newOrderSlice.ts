import { orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface NewOrderState {
  request: boolean;
  orderData: TOrder | null;
  error: string | null | undefined;
}

const initialState: NewOrderState = {
  request: false,
  orderData: null,
  error: null
};

export const newOrder = createAsyncThunk(
  'order/create',
  async (data: string[]) => orderBurgerApi(data)
);

export const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    resetOrder: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(newOrder.fulfilled, (state, action) => {
        state.request = false;
        state.orderData = action.payload.order;
      })
      .addCase(newOrder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(newOrder.pending, (state) => {
        state.request = true;
      });
  }
});

export const { resetOrder } = newOrderSlice.actions;
