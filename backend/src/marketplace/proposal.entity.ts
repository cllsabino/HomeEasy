import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { ProposalStatus } from './marketplace.enums';
import { ServiceRequest } from './service-request.entity';

@Entity({ name: 'proposals' })
@Unique('proposals_request_professional_unique', ['requestId', 'professionalId'])
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId: string;

  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  request: ServiceRequest;

  @Column({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @ManyToOne(() => ProfessionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: ProfessionalProfile;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'estimated_duration_minutes', type: 'integer' })
  estimatedDurationMinutes: number;

  @Column({ name: 'materials_included', default: false })
  materialsIncluded: boolean;

  @Column({ name: 'travel_fee', type: 'numeric', precision: 10, scale: 2, default: 0 })
  travelFee: string;

  @Column({ name: 'payment_methods', type: 'varchar', array: true, default: () => "'{}'" })
  paymentMethods: string[];

  @Column({ type: 'enum', enum: ProposalStatus, default: ProposalStatus.Sent })
  status: ProposalStatus;

  @Column({ name: 'valid_until', type: 'timestamptz' })
  validUntil: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
