import { ApiAuthenticatedUser, ApiAuthResponse } from '../models/api-auth';

export const apiAccessTokenStorageKey = 'homeEasyAccessToken';
export const apiRefreshTokenStorageKey = 'homeEasyRefreshToken';
export const apiUserStorageKey = 'homeEasyUser';

export function storeApiSession(response: ApiAuthResponse): ApiAuthenticatedUser {
  const user = Object.assign({}, response.user, { uid: response.user.id });
  localStorage.setItem(apiAccessTokenStorageKey, response.accessToken);
  localStorage.setItem(apiRefreshTokenStorageKey, response.refreshToken);
  localStorage.setItem(apiUserStorageKey, JSON.stringify(user));
  return user;
}

export function readStoredApiUser(): ApiAuthenticatedUser | null {
  const serializedUser = localStorage.getItem(apiUserStorageKey);
  if (!serializedUser) {
    return null;
  }
  try {
    return JSON.parse(serializedUser) as ApiAuthenticatedUser;
  } catch {
    clearApiSession();
    return null;
  }
}

export function clearApiSession() {
  localStorage.removeItem(apiAccessTokenStorageKey);
  localStorage.removeItem(apiRefreshTokenStorageKey);
  localStorage.removeItem(apiUserStorageKey);
}
