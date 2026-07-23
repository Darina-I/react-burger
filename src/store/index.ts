import { ingredientsApi } from '@/services/ingredients/ingredientsApi';
import ingredientReducer from '@/services/ingredients/ingredientSlice';
import { orderApi } from '@/services/order/orderApi';
import orderReducer from '@/services/order/orderSlice';
import { configureStore, combineSlices } from '@reduxjs/toolkit';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  order: orderReducer,
  ingredient: ingredientReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ingredientsApi.middleware, orderApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
