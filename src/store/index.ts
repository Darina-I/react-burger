import { ingredientsApi } from '@/services/ingredients/ingredientsApi';
import ingredientReducer from '@/services/ingredients/ingredientSlice';
import { orderApi, orderWsApi } from '@/services/order/orderApi';
import orderReducer from '@/services/order/orderSlice';
import { authApi } from '@/services/user/authApi';
import { userApi } from '@/services/user/userApi';
import { configureStore, combineSlices } from '@reduxjs/toolkit';

import userReducer from '@services/user/userSlice';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [orderWsApi.reducerPath]: orderWsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
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
      orderWsApi.middleware,
      authApi.middleware,
      userApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
