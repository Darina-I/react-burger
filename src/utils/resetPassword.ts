export const RESET_FLOW_FLAG_KEY = 'resetPassword_hasRequested';

export const setResetFlag = (): void => {
  localStorage.setItem(RESET_FLOW_FLAG_KEY, 'true');
};

export const getResetFlag = (): boolean => {
  return localStorage.getItem(RESET_FLOW_FLAG_KEY) === 'true';
};

export const clearResetFlag = (): void => {
  localStorage.removeItem(RESET_FLOW_FLAG_KEY);
};
