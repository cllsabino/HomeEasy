import { Body, Controller, Get, NotFoundException, Put } from '@nestjs/common';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@AuthenticatedUser() authenticatedUser: PublicUser) {
    const profile = await this.usersService.findOwnProfile(authenticatedUser.id);
    if (!profile) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return profile;
  }

  @Put('me')
  updateCurrentUser(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    return this.usersService.updateOwnProfile(authenticatedUser.id, updateUserProfileDto);
  }
}
