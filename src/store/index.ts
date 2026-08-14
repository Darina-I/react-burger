import { ingredientsApi } from '@/services/ingredients/ingredientsApi';
import ingredientReducer from '@/services/ingredients/ingredientSlice';
import { orderApi } from '@/services/order/orderApi';
import orderReducer from '@/services/order/orderSlice';
import { authApi } from '@/services/user/authApi';
import { configureStore, combineSlices } from '@reduxjs/toolkit';

import userReducer from '@services/user/userSlice';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  order: orderReducer,
  ingredient: ingredientReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ingredientsApi.middleware,
      orderApi.middleware,
      authApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
