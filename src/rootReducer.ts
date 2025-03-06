import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/orderSlice';
import { newOrderSlice } from './slices/newOrderSlice';
import { feedsSlice } from './slices/feedSlice';
import { burgerConstructorSlice } from './slices/burgerConstructor';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  orders: ordersSlice.reducer,
  newOrder: newOrderSlice.reducer,
  feeds: feedsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});

export default rootReducer;
