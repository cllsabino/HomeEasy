import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { MediaObject } from '../storage/media-object.entity';
import { User } from '../users/user.entity';
import { ModerationStatus, VerificationDocumentType } from './moderation.enums';

@Entity({ name: 'verification_documents' })
export class VerificationDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'professional_id', type: 'uuid' })
  professionalId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: User;

  @Column({ name: 'media_id', type: 'uuid', unique: true })
  mediaId: string;

  @ManyToOne(() => MediaObject, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'media_id' })
  media: MediaObject;

  @Column({ type: 'enum', enum: VerificationDocumentType })
  type: VerificationDocumentType;

  @Column({ type: 'enum', enum: ModerationStatus, default: ModerationStatus.Pending })
  status: ModerationStatus;

  @Column({ name: 'review_notes', type: 'text', nullable: true })
  reviewNotes: string | null;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
