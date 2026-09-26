import { describe, it, expect, vi, beforeEach } from 'vitest';

import { authApi } from './authApi';
import { userApi } from './userApi';
import userReducer, { clearUser, checkAuthStatus } from './userSlice';

import type { TUser } from '@/utils/types';
type UserState = ReturnType<typeof userReducer>;

const mockUser = {
  _id: '1',
  name: 'Иван',
  email: 'i@t.com',
} as TUser;

type QueryStatus = 'pending' | 'fulfilled' | 'rejected';
type CreateRtkQueryActionParams<TPayload = unknown> = {
  api: {
    reducerPath: string;
  };
  endpointName: string;
  status: QueryStatus;
  payload?: TPayload;
  requestId?: string;
};

const createRtkQueryAction = <TPayload = unknown>({
  api,
  endpointName,
  status,
  payload,
  requestId = 'test-request-id',
}: CreateRtkQueryActionParams<TPayload>): {
  type: string;
  payload?: TPayload;
  meta: {
    requestId: string;
    arg: {
      type: 'mutation';
      endpointName: string;
      originalArgs: undefined;
      track: boolean;
      fixedCacheKey: undefined;
    };
  };
} => {
  return {
    type: `${api.reducerPath}/executeMutation/${status}`,

    ...(payload !== undefined ? { payload } : {}),

    meta: {
      requestId,

      arg: {
        type: 'mutation',
        endpointName,
        originalArgs: undefined,
        track: true,
        fixedCacheKey: undefined,
      },
    },
  };
};

describe('userSlice', () => {
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

  beforeEach(() => {
    vi.clearAllMocks();
    setItemSpy.mockImplementation(() => undefined);
    removeItemSpy.mockImplementation(() => undefined);
  });

  it('начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    });
  });

  it('clearUser: сбрасывает стейт и удаляет токены', () => {
    const prev: UserState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: true,
      error: 'x',
    };
    const state = userReducer(prev, clearUser());

    expect(state).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    expect(removeItemSpy).toHaveBeenCalledWith('accessToken');
    expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
  });

  it('checkAuthStatus.fulfilled: сохраняет пользователя', () => {
    const action = checkAuthStatus.fulfilled(
      { user: mockUser, isAuthenticated: true },
      'r1'
    );
    const state = userReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('checkAuthStatus.fulfilled: без пользователя', () => {
    const action = checkAuthStatus.fulfilled(
      { user: null, isAuthenticated: false },
      'r1'
    );
    const state = userReducer(undefined, action);

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('login.fulfilled: сохраняет user и токены', () => {
    const payload = {
      user: mockUser,
      accessToken: 'a1',
      refreshToken: 'r1',
    };

    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'login',
      status: 'fulfilled',
      payload,
    });

    const state = userReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', 'a1');
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', 'r1');
  });

  it('login.rejected', () => {
    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'login',
      status: 'rejected',
    });

    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при входе');
  });

  it('register.fulfilled: сохраняет user и токены', () => {
    const payload = {
      user: mockUser,
      accessToken: 'a2',
      refreshToken: 'r2',
    };

    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'register',
      status: 'fulfilled',
      payload,
    });

    const state = userReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', 'a2');
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', 'r2');
  });

  it('register.rejected', () => {
    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'register',
      status: 'rejected',
    });

    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при регистрации');
  });

  it('refresh.fulfilled', () => {
    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'refresh',
      status: 'fulfilled',
    });

    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('refresh.rejected', () => {
    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'refresh',
      status: 'rejected',
    });

    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при обновлении токена');
  });

  it('logout.fulfilled: сбрасывает пользователя', () => {
    const previousState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: true,
      error: null,
    };

    const action = createRtkQueryAction({
      api: authApi,
      endpointName: 'logout',
      status: 'fulfilled',
    });

    const state = userReducer(previousState, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('updateUser.fulfilled: обновляет пользователя', () => {
    const updatedUser = {
      ...mockUser,
      name: 'Пётр',
    };

    const action = createRtkQueryAction({
      api: userApi,
      endpointName: 'updateUser',
      status: 'fulfilled',
      payload: {
        user: updatedUser,
      },
    });

    const state = userReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(updatedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('updateUser.rejected', () => {
    const action = createRtkQueryAction({
      api: userApi,
      endpointName: 'updateUser',
      status: 'rejected',
    });

    const state = userReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при изменении профиля');
  });
});
