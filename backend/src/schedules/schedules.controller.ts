import { Body, Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { Public } from '../auth/public.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { ReplaceScheduleDto } from './dto/replace-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('me')
  findOwn(@AuthenticatedUser() authenticatedUser: PublicUser) {
    return this.schedulesService.findByProfessional(authenticatedUser.id);
  }

  @Put('me')
  replaceOwn(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() replaceScheduleDto: ReplaceScheduleDto
  ) {
    return this.schedulesService.replaceOwn(authenticatedUser.id, replaceScheduleDto);
  }

  @Public()
  @Get(':professionalId')
  findPublic(@Param('professionalId', ParseUUIDPipe) professionalId: string) {
    return this.schedulesService.findByProfessional(professionalId);
  }
}
