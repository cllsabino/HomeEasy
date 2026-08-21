import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PublicUser } from '../shared/utils/public-user.utils';

export const AuthenticatedUser = createParamDecorator(
  (_value: unknown, context: ExecutionContext): PublicUser =>
    context.switchToHttp().getRequest<{ user: PublicUser }>().user
);
