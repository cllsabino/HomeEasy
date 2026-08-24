import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiSessionService } from './api-session.service';

@Injectable({ providedIn: 'root' })
export class OnlinePresenceService {
  private heartbeatSubscription: Subscription;

  constructor(private http: HttpClient, private sessionService: ApiSessionService) {}

  start() {
    if (this.heartbeatSubscription) {
      return;
    }
    this.heartbeatSubscription = this.sessionService.user$
      .pipe(
        switchMap(user => user
          ? timer(0, 60_000).pipe(
              switchMap(() => this.http.put(`${environment.apiUrl}/presence/heartbeat`, {}).pipe(
                catchError(() => EMPTY)
              ))
            )
          : EMPTY
        )
      )
      .subscribe();
  }

  stop() {
    this.heartbeatSubscription?.unsubscribe();
    this.heartbeatSubscription = null;
  }
}
