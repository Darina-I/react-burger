export const BASE_URL_API = ' https://new-stellarburgers.education-services.ru/api';

export const INGREDIENT_API = `/ingredients`;
export const ORDER_API = '/orders';
export const AUTH_API = '/auth';
export const USER_API = '/auth/user';
export const RESET_PASSWORD_API = '/password-reset';

export const publicEndpoints = new Set([
  'login',
  'register',
  'refresh',
  'passwordReset',
  'resetCode',
]);
