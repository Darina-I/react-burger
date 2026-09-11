import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { BurgerItem, OrderIngredient, TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type OrderState = {
  buns: BurgerItem | null;
  ingredients: BurgerItem[];
  currentOrder: OrderIngredient | null;
  isModalOpen: boolean;
};

const initialState: OrderState = {
  buns: null,
  ingredients: [],
  currentOrder: null,
  isModalOpen: false,
};

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (newIngredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...newIngredient, nanoid: id } };
      },
      reducer: (state, action: PayloadAction<BurgerItem>) => {
        const newIngredient = action.payload;

        if (newIngredient.type === 'bun') {
          state.buns = newIngredient;
          return;
        }

        state.ingredients.push(newIngredient);
      },
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
    cleanOrder: (state) => {
      state.buns = null;
      state.ingredients = [];
    },
    openDetailsOrder: (state, action: PayloadAction<OrderIngredient | null>) => {
      state.currentOrder = action.payload;
      state.isModalOpen = true;
    },
    closeDetailsModal: (state) => {
      state.currentOrder = null;
      state.isModalOpen = false;
    },
  },
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  cleanOrder,
  openDetailsOrder,
  closeDetailsModal,
} = OrderSlice.actions;
export default OrderSlice.reducer;
