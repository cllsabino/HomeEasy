import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { PublicUser } from '../shared/utils/public-user.utils';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: PublicUser }>();
    if (request.user?.role !== UserRole.Admin) {
      throw new ForbiddenException('Esta ação exige permissão de administrador.');
    }
    return true;
  }
}
