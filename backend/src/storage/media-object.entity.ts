import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { MediaPurpose } from './media-purpose.enum';

@Entity({ name: 'media_objects' })
export class MediaObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'enum', enum: MediaPurpose })
  purpose: MediaPurpose;

  @Column({ name: 'object_key', unique: true, length: 500 })
  objectKey: string;

  @Column({ name: 'file_name', length: 180 })
  fileName: string;

  @Column({ name: 'content_type', length: 100 })
  contentType: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({ name: 'context_id', type: 'uuid', nullable: true })
  contextId: string | null;

  @Column({ name: 'uploaded_at', type: 'timestamptz', nullable: true })
  uploadedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
