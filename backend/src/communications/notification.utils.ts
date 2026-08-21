import { EntityManager } from 'typeorm';

import { NotificationType } from './communication.enums';
import { Notification } from './notification.entity';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl: string;
}

export function createNotification(manager: EntityManager, input: CreateNotificationInput) {
  return manager.save(manager.create(Notification, { ...input, readAt: null }));
}
