import { BASE_URL_API, AUTH_API, publicEndpoints } from '@api/config';
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_API,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem('accessToken');
    if (!publicEndpoints.has(endpoint) && token) {
      headers.set('Authorization', token);
    }
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 && result.error?.status !== 403) {
    return result;
  }

  const token = localStorage.getItem('refreshToken');

  if (!token) {
    return {
      error: {
        status: 401,
        data: 'Session expired',
      },
    };
  }

  const refreshResult = await baseQuery(
    {
      url: `${AUTH_API}/token`,
      method: 'POST',
      body: {
        token: token,
      },
    },
    api,
    extraOptions
  );

  if (refreshResult.data) {
    const data = refreshResult.data as {
      success: boolean;
      accessToken: string;
      refreshToken: string;
    };
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    result = await baseQuery(args, api, extraOptions);

    return result;
  }

  return {
    error: {
      status: 401,
      data: 'Failed to refresh token',
    },
  };
};
