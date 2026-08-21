import { PublicUser } from '../shared/utils/public-user.utils';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}
