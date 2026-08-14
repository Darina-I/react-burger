import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from './authApi';
import { userApi } from './userApi';

import type { TUser } from '@/utils/types';

type UserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { dispatch }) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return { user: null, isAuthenticated: false };
    }

    try {
      const result = await dispatch(userApi.endpoints.checkAuth.initiate()).unwrap();

      if (result.success && result.user) {
        return { user: result.user, isAuthenticated: true };
      }
      throw new Error('Token invalid');
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = 'Ошибка проверки сессии';
      });
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при входе';
      });

    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при регистрации';
      });
    builder
      .addMatcher(authApi.endpoints.refresh.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.refresh.matchFulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.refresh.matchRejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при обновлении токена';
      });
    builder
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при выходе';
      });

    builder
      .addMatcher(userApi.endpoints.updateUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(userApi.endpoints.updateUser.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addMatcher(userApi.endpoints.updateUser.matchRejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при изменении профиля';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
