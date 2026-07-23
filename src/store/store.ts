import { configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from '../api/ingredientsApi';
import burgerReducer from './burgerSlice';
import ingredientReducer from './ingredientSlice';

export const store = configureStore({
  reducer: {
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
    burger: burgerReducer,
    ingredient: ingredientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
