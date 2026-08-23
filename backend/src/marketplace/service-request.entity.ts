import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Service } from '../services/service.entity';
import { User } from '../users/user.entity';
import { GeographicPoint } from '../professionals/professional-profile.entity';
import { ServiceRequestStatus, ServiceUrgency } from './marketplace.enums';

export interface RequestAttachmentMetadata {
  mediaId: string;
  objectKey: string;
  fileName: string;
  contentType: string;
}

@Entity({ name: 'service_requests' })
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'service_id', length: 12 })
  serviceId: string;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ServiceUrgency, default: ServiceUrgency.Flexible })
  urgency: ServiceUrgency;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  answers: Record<string, string | number | boolean>;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  attachments: RequestAttachmentMetadata[];

  @Column({ length: 200 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  location: GeographicPoint | null;

  @Column({ name: 'budget_minimum', type: 'numeric', precision: 10, scale: 2, nullable: true })
  budgetMinimum: string | null;

  @Column({ name: 'budget_maximum', type: 'numeric', precision: 10, scale: 2, nullable: true })
  budgetMaximum: string | null;

  @Column({ name: 'preferred_at', type: 'timestamptz', nullable: true })
  preferredAt: Date | null;

  @Column({ type: 'enum', enum: ServiceRequestStatus, default: ServiceRequestStatus.Requested })
  status: ServiceRequestStatus;

  @Column({ name: 'proposal_count', type: 'smallint', default: 0 })
  proposalCount: number;

  @Column({ name: 'maximum_proposals', type: 'smallint', default: 4 })
  maximumProposals: number;

  @Column({ name: 'preferred_professional_id', type: 'uuid', nullable: true })
  preferredProfessionalId: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
