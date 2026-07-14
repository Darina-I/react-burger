import axios, { isAxiosError } from 'axios';

import { BASE_URL_API } from './constant';

type RequestOptions<TData = unknown> = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: TData;
};

export async function request<TResponse>(options: RequestOptions): Promise<TResponse> {
  const { url, method = 'get', data } = options;

  try {
    const response = await axios<TResponse>({
      method,
      url: BASE_URL_API + url,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    throw new Error(`Request failed with status ${response.status}`);
  } catch (error) {
    if (isAxiosError(error)) {
      const msg = error.response
        ? `Ошибка API: ${error.response.status} ${error.message}`
        : `Ошибка сети: ${error.message}`;
      throw new Error(msg);
    }
    throw error;
  }
}
