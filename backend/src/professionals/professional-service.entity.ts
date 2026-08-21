import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Service } from '../services/service.entity';
import { ProfessionalProfile } from './professional-profile.entity';

@Entity({ name: 'professional_services' })
export class ProfessionalService {
  @PrimaryColumn({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @PrimaryColumn({ name: 'service_id', length: 12 })
  serviceId: string;

  @ManyToOne(() => ProfessionalProfile, (professional) => professional.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: ProfessionalProfile;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'base_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  basePrice: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
