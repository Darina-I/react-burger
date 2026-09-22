import { BASE_URL_API, AUTH_API } from './config';
export const refreshWssToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL_API}${AUTH_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  const data = (await res.json()) as {
    success: boolean;
    accessToken: string;
    refreshToken: string;
  };

  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken.replace('Bearer ', '');
  }
  return null;
};
