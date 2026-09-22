import { ORDER_API, ORDER_WS_API } from '@api/config';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from '../api/baseQueryWithAuth';
import { refreshWssToken } from '../api/refreshToken';

import type { OrderIngredient, Orders } from '@/utils/types';

type CacheEntryApi = {
  updateCachedData: (recipe: (draft: Orders) => void) => void;
  cacheDataLoaded: Promise<{ data: Orders }>;
  cacheEntryRemoved: Promise<void>;
};

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

let allOrdersSocket: WebSocket | null = null;
let userOrdersSocket: WebSocket | null = null;

export const orderWsApi = createApi({
  reducerPath: 'OrderWsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getAllOrders: builder.query<Orders, void>({
      queryFn: () => ({
        data: { success: true, orders: [], total: 0, totalToday: 0 },
      }),

      onCacheEntryAdded: async (
        _arg: void,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }: CacheEntryApi
      ) => {
        allOrdersSocket = new WebSocket(ORDER_WS_API + '/all');

        try {
          await cacheDataLoaded;

          allOrdersSocket.onmessage = (event: MessageEvent<string>): void => {
            const data: Orders = JSON.parse(event.data) as Orders;

            if (data.success) {
              updateCachedData((draft) => {
                draft.orders = data.orders;
                draft.total = data.total;
                draft.totalToday = data.totalToday;
              });
            }
          };
        } catch (e) {
          console.warn('[WebSocket] Connection setup error', e);
        }

        await cacheEntryRemoved;
        allOrdersSocket?.close();
        allOrdersSocket = null;
      },
    }),

    getUserOrders: builder.query<Orders, void>({
      queryFn: () => ({
        data: { success: true, orders: [], total: 0, totalToday: 0 },
      }),

      onCacheEntryAdded: async (
        _arg: void,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }: CacheEntryApi
      ) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          await cacheEntryRemoved;
          return;
        }

        const connect = (accessToken: string): void => {
          userOrdersSocket = new WebSocket(`${ORDER_WS_API}?token=${accessToken}`);

          userOrdersSocket.onmessage = async (
            event: MessageEvent<string>
          ): Promise<void> => {
            const data = JSON.parse(event.data) as
              | {
                  orders: OrderIngredient[];
                  total: number;
                  totalToday: number;
                  success: boolean;
                }
              | { message: string };

            if ('message' in data && data.message === 'Invalid or missing token') {
              userOrdersSocket?.close();

              const refreshToken = await refreshWssToken();
              if (refreshToken) connect(refreshToken);
              return;
            }

            if ('success' in data && data.success) {
              updateCachedData((draft) => {
                draft.orders = data.orders;
                draft.total = data.total;
                draft.totalToday = data.totalToday;
              });
            }
          };
        };

        try {
          await cacheDataLoaded;
          connect(token);
        } catch (e) {
          console.warn('[WebSocket] Connection setup error', e);
        }

        await cacheEntryRemoved;
        userOrdersSocket?.close();
        userOrdersSocket = null;
      },
    }),
  }),
});

export const { usePostOrderMutation } = orderApi;
export const { useGetAllOrdersQuery, useGetUserOrdersQuery } = orderWsApi;
