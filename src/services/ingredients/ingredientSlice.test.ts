import { describe, expect, it } from 'vitest';

import ingredientReducer, {
  detailsIngredient,
  closeIngredientModal,
} from './ingredientSlice';

import type { TIngredient } from '@/utils/types';

describe('ingredientSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    __v: 0,
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  };

  it('Начальное состояние корректно', () => {
    const state = ingredientReducer(undefined, { type: '' });
    expect(state).toEqual({
      details: null,
      isModalOpen: false,
    });
  });

  it('detailsIngredient запоминает ингредиент и открывает модалку', () => {
    const prevState = { details: null, isModalOpen: false };

    const nextState = ingredientReducer(prevState, detailsIngredient(mockIngredient));

    expect(nextState).toEqual({
      details: mockIngredient,
      isModalOpen: true,
    });
  });

  it('closeIngredientModal сбрасывает ингредиент и закрывает модалку', () => {
    const prevState = { details: mockIngredient, isModalOpen: true };

    const nextState = ingredientReducer(prevState, closeIngredientModal());

    expect(nextState).toEqual({
      details: null,
      isModalOpen: false,
    });
  });
});
