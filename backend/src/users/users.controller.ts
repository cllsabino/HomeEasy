import { Controller, Get, NotFoundException } from '@nestjs/common';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { PublicUser, toPublicUser } from '../shared/utils/public-user.utils';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@AuthenticatedUser() authenticatedUser: PublicUser) {
    const user = await this.usersService.findById(authenticatedUser.id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return toPublicUser(user);
  }
}
