import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { TIngredient, BurgerItem } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type BurgerState = {
  buns: BurgerItem | null;
  ingredients: BurgerItem[];
};

const initialState: BurgerState = {
  buns: null,
  ingredients: [],
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newIngredient = { ...action.payload, nanoid: nanoid() };

      if (newIngredient.type === 'bun') {
        state.buns = newIngredient;
        return;
      }

      state.ingredients.push(newIngredient);
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      const nanoidDelete = action.payload;
      state.ingredients = state.ingredients.filter(
        (item) => item.nanoid !== nanoidDelete
      );
    },
    moveIngredient: (state, action: PayloadAction<{ fromId: string; toId: string }>) => {
      const { fromId, toId } = action.payload;

      const fromIndex = state.ingredients.findIndex((i) => i.nanoid === fromId);
      const toIndex = state.ingredients.findIndex((i) => i.nanoid === toId);

      const dragItem = state.ingredients.splice(fromIndex, 1)[0];
      state.ingredients.splice(toIndex, 0, dragItem);
    },
  },
});

export const { addIngredient, deleteIngredient, moveIngredient } = burgerSlice.actions;
export default burgerSlice.reducer;
