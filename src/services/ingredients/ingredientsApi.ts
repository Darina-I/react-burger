import { BASE_URL_API } from '@/utils/constant';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { INGREDIENT_API } from '../../api/config';

import type { TIngredient } from '@/utils/types';

type IngredientResponse = {
  data: TIngredient[];
  success: boolean;
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_API }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => INGREDIENT_API,
      transformResponse: (response) => {
        return (response as IngredientResponse).data;
      },
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
