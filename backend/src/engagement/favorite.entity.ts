import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryColumn({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @PrimaryColumn({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @ManyToOne(() => ProfessionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: ProfessionalProfile;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
