import { User } from '../../users/user.entity';
import { UserRole } from '../../users/user-role.enum';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}
