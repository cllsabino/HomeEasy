import { Injectable } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';

import { Notification } from './notification.entity';
import { PushNotificationService } from './push-notification.service';

@Injectable()
export class NotificationSubscriber implements EntitySubscriberInterface<Notification> {
  constructor(
    dataSource: DataSource,
    private readonly pushNotificationService: PushNotificationService
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Notification;
  }

  afterInsert(event: InsertEvent<Notification>): void {
    void this.pushNotificationService.sendNotification(event.entity).catch(() => undefined);
  }
}
