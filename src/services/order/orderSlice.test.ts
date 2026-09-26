import { nanoid } from 'nanoid';
import { describe, it, expect } from 'vitest';

import orderReducer, {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  cleanOrder,
  openDetailsOrder,
  closeDetailsModal,
} from './orderSlice';

import type { BurgerItem, OrderIngredient } from '@/utils/types';

const createIngredient = (type: 'bun' | 'ingredient', name: string): BurgerItem => ({
  _id: 'eifjv3irup9834eupfiodjck',
  nanoid: nanoid(),
  __v: 0,
  name,
  type,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'https://example.com/img.png',
  image_mobile: 'https://example.com/img_m.png',
  image_large: 'https://example.com/img_l.png',
});

describe('orderSlice', () => {
  it('Начальное состояние корректно', () => {
    const state = orderReducer(undefined, { type: '' });
    expect(state).toEqual({
      buns: null,
      ingredients: [],
      currentOrder: null,
      isModalOpen: false,
    });
  });

  it('addIngredient: добавляет булку в buns', () => {
    const bun = createIngredient('bun', 'Краторная булка');
    const prevState = orderReducer(undefined, { type: '' });

    const nextState = orderReducer(prevState, addIngredient(bun));

    expect(nextState.buns).not.toBeNull();
    expect(nextState.buns?.name).toBe('Краторная булка');
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('addIngredient: добавляет ингредиент в массив ingredients', () => {
    const ingredient = createIngredient('ingredient', 'Сыр');
    const prevState = orderReducer(undefined, { type: '' });

    const nextState = orderReducer(prevState, addIngredient(ingredient));

    expect(nextState.buns).toBeNull();
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].name).toBe('Сыр');
  });

  it('deleteIngredient: удаляет ингредиент по nanoid', () => {
    const ing1 = createIngredient('ingredient', 'Сыр');
    const ing2 = createIngredient('ingredient', 'Огурец');

    let state = orderReducer(undefined, { type: '' });
    state = orderReducer(state, addIngredient(ing1));
    state = orderReducer(state, addIngredient(ing2));

    const itemToDelete = state.ingredients[0]; // удаляем первый
    const nextState = orderReducer(state, deleteIngredient(itemToDelete.nanoid));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].name).toBe('Огурец'); // остался второй
  });

  it('moveIngredient: корректно меняет порядок ингредиентов', () => {
    const i1 = createIngredient('ingredient', '1-Сыр');
    const i2 = createIngredient('ingredient', '2-Огурец');
    const i3 = createIngredient('ingredient', '3-Помидор');

    let state = orderReducer(undefined, { type: '' });
    [i1, i2, i3].forEach((i) => (state = orderReducer(state, addIngredient(i))));

    const storeIngredients = state.ingredients;

    const nextState = orderReducer(
      state,
      moveIngredient({
        fromId: storeIngredients[0].nanoid,
        toId: storeIngredients[1].nanoid,
      })
    );

    expect(nextState.ingredients.map((i) => i.name)).toEqual([
      '2-Огурец',
      '1-Сыр',
      '3-Помидор',
    ]);
  });

  it('cleanOrder: полностью очищает заказ', () => {
    const bun = createIngredient('bun', 'Булка');
    const ing = createIngredient('ingredient', 'Салат');

    let state = orderReducer(undefined, { type: '' });
    state = orderReducer(state, addIngredient(bun));
    state = orderReducer(state, addIngredient(ing));

    const nextState = orderReducer(state, cleanOrder());

    expect(nextState.buns).toBeNull();
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('openDetailsOrder: устанавливает currentOrder и открывает модалку', () => {
    const mockOrder: OrderIngredient = {
      _id: 'order-123',
      name: 'Салат',
      ingredients: ['id1', 'id2'],
      status: 'created',
      number: 29746,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const prevState = orderReducer(undefined, { type: '' });
    const nextState = orderReducer(prevState, openDetailsOrder(mockOrder));

    expect(nextState.currentOrder).toBe(mockOrder);
    expect(nextState.isModalOpen).toBe(true);
  });

  it('closeDetailsModal: сбрасывает currentOrder и закрывает модалку', () => {
    const mockOrder: OrderIngredient = {
      _id: 'order-123',
      name: 'Салат',
      ingredients: ['id1', 'id2'],
      status: 'created',
      number: 29746,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let state = orderReducer(undefined, { type: '' });
    state = orderReducer(state, openDetailsOrder(mockOrder)); // сначала открываем

    const nextState = orderReducer(state, closeDetailsModal());

    expect(nextState.currentOrder).toBeNull();
    expect(nextState.isModalOpen).toBe(false);
  });
});
