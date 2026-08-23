import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiSessionService } from './api-session.service';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  constructor(private sessionService: ApiSessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }
    const authenticatedRequest = this.withAccessToken(request);
    return next.handle(authenticatedRequest).pipe(
      catchError(error => {
        if (!(error instanceof HttpErrorResponse) || error.status !== 401 || this.isAuthRequest(request.url)) {
          return throwError(() => error);
        }
        return this.sessionService.refreshAccessToken().pipe(
          switchMap(() => next.handle(this.withAccessToken(request))),
          catchError(refreshError => {
            this.sessionService.clearSession();
            return throwError(() => refreshError);
          })
        );
      })
    );
  }

  private withAccessToken(request: HttpRequest<unknown>) {
    const accessToken = this.sessionService.accessToken;
    return accessToken
      ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : request;
  }

  private isAuthRequest(url: string) {
    return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
  }
}
