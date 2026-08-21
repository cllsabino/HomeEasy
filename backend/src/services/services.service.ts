import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>
  ) {}

  findActive() {
    return this.servicesRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', name: 'ASC' },
      select: { id: true, name: true, category: true }
    });
  }
}
