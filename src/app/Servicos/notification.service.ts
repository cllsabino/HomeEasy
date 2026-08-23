import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

export interface ApiNotification {
  id: string;
  title: string;
  body: string;
  actionUrl: string;
  readAt?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  findNotifications() {
    return this.http.get<ApiNotification[]>(`${environment.apiUrl}/notifications`);
  }

  markRead(notificationId: string) {
    return this.http.patch(`${environment.apiUrl}/notifications/${notificationId}/read`, {});
  }
}
