import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity({ name: 'user_presence' })
export class UserPresence {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'typing_conversation_id', type: 'uuid', nullable: true })
  typingConversationId: string | null;

  @Column({ name: 'typing_expires_at', type: 'timestamptz', nullable: true })
  typingExpiresAt: Date | null;

  @UpdateDateColumn({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt: Date;
}
