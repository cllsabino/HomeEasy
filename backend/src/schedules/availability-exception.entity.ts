import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';

@Entity({ name: 'availability_exceptions' })
@Unique('availability_exceptions_unique_date', ['professionalId', 'date'])
export class AvailabilityException {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @ManyToOne(() => ProfessionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: ProfessionalProfile;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'is_unavailable', default: true })
  isUnavailable: boolean;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;
}
