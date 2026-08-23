import { UserRole } from '../../Usuarios/usuario';

export interface ApiAuthenticatedUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<ApiAuthenticatedUser, 'uid'>;
}
