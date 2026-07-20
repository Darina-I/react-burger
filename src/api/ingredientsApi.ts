import { request } from '@/utils/request';

import { INGREDIENT_API } from './config';

import type { TIngredient } from '@/utils/types';

export const getIngredients = async (): Promise<{ data: TIngredient[] }> => {
  return request<{ data: TIngredient[] }>({
    url: INGREDIENT_API,
    method: 'get',
  });
};
