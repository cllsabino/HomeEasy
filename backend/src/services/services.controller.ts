import { Controller, Get } from '@nestjs/common';

import { Public } from '../auth/public.decorator';
import { ServicesService } from './services.service';

@Public()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findActive() {
    return this.servicesService.findActive();
  }
}
