import { baseQueryWithAuth } from '@api/baseQueryWithAuth';
import { INGREDIENT_API } from '@api/config';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { TIngredient } from '@/utils/types';

type IngredientResponse = {
  data: TIngredient[];
  success: boolean;
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: baseQueryWithAuth,
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
