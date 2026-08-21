import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ServiceRequestFieldDefinition } from './service-request-field.types';

@Entity({ name: 'services' })
export class Service {
  @PrimaryColumn({ length: 12 })
  id: string;

  @Column({ unique: true, length: 120 })
  name: string;

  @Column({ length: 80 })
  category: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'request_form', type: 'jsonb', default: () => "'[]'::jsonb" })
  requestForm: ServiceRequestFieldDefinition[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
