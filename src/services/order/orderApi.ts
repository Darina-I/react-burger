import { ORDER_API } from '@api/config';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '../api/baseQueryWithAuth';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    postOrder: builder.mutation<
      { name: string; order: { number: number }; success: boolean },
      { ingredients: string[] }
    >({
      query: (data) => ({
        url: ORDER_API,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { usePostOrderMutation } = orderApi;
