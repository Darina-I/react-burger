import { USER_API } from '@api/config';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '../api/baseQueryWithAuth';

export const userApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    checkAuth: builder.query<
      { success: true; user: { email: string; name: string } },
      void
    >({
      query: () => ({
        url: USER_API,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation<
      {
        success: boolean;
        user: { email: string; name: string };
      },
      { email: string; password: string; name: string }
    >({
      query: (data) => ({
        url: USER_API,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const { useUpdateUserMutation, useCheckAuthQuery } = userApi;
