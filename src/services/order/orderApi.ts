import { BASE_URL_API } from '@/utils/constant';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ORDER_API } from '../../api/config';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_API }),
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
