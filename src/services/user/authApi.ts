import { AUTH_API, RESET_PASSWORD_API } from '@api/config';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '../api/baseQueryWithAuth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    register: builder.mutation<
      {
        success: boolean;
        user: { email: string; name: string };
        accessToken: string;
        refreshToken: string;
      },
      { email: string; password: string; name: string }
    >({
      query: (data) => ({
        url: AUTH_API + '/register',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation<
      {
        success: boolean;
        user: { email: string; name: string };
        accessToken: string;
        refreshToken: string;
      },
      { email: string; password: string }
    >({
      query: (data) => ({
        url: AUTH_API + '/login',
        method: 'POST',
        body: data,
      }),
    }),

    refresh: builder.mutation<
      {
        success: boolean;
        accessToken: string;
        refreshToken: string;
      },
      { token: string }
    >({
      query: (data) => ({
        url: AUTH_API + '/token',
        method: 'POST',
        body: data,
      }),
    }),

    logout: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        token: string;
      }
    >({
      query: (data) => ({
        url: AUTH_API + '/logout',
        method: 'POST',
        body: data,
      }),
    }),

    passwordReset: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        email: string;
      }
    >({
      query: (data) => ({
        url: RESET_PASSWORD_API,
        method: 'POST',
        body: data,
      }),
    }),

    resetCode: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        password: string;
        token: string;
      }
    >({
      query: (data) => ({
        url: RESET_PASSWORD_API + '/reset',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  usePasswordResetMutation,
  useResetCodeMutation,
} = authApi;
