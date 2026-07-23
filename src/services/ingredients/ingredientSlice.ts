import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type IngredientState = {
  details: TIngredient | null;
  isModalOpen: boolean;
};

const initialState: IngredientState = {
  details: null,
  isModalOpen: false,
};

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    detailsIngredient: (state, action: PayloadAction<TIngredient | null>) => {
      state.details = action.payload;
      state.isModalOpen = true;
    },
    closeIngredientModal: (state) => {
      state.details = null;
      state.isModalOpen = false;
    },
  },
});

export const { detailsIngredient, closeIngredientModal } = ingredientSlice.actions;
export default ingredientSlice.reducer;
