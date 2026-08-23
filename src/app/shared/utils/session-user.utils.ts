import { ApiAuthenticatedUser } from '../models/api-auth';
import { readStoredApiUser } from './api-auth-storage.utils';

export function getCurrentUser(): ApiAuthenticatedUser | null {
  return readStoredApiUser();
}
