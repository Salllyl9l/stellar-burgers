import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser;
  error: string | null | undefined;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: {
    email: '',
    name: ''
  },
  error: ''
};

export const getUser = createAsyncThunk('user/auth', async () => getUserApi());

export const registrationUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.isInit = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isInit = false;
      state.error = action.error.message;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = action.payload.user;
    });

    builder.addCase(registrationUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registrationUser.rejected, (state, action) => {
      state.isLoading = true;
      state.error = action.error.message;
    });
    builder.addCase(registrationUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isInit = true;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isInit = true;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = { email: '', name: '' };
      state.isInit = false;
    });

    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isInit = false;
        state.error = action.error.message!;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = '';
      });
  }
});

export default userSlice;
