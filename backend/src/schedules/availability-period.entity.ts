import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';

@Entity({ name: 'availability_periods' })
@Unique('availability_periods_unique_time', ['professionalId', 'weekday', 'startTime', 'endTime'])
export class AvailabilityPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @ManyToOne(() => ProfessionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: ProfessionalProfile;

  @Column({ type: 'smallint' })
  weekday: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;
}
