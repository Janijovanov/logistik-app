import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { NotificationService } from '../services/notification.service';

let isRefreshing = false;
const refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const notifications = inject(NotificationService);

  // Skip error notifications for asset/i18n requests
  if (req.url.includes('/assets/') || req.url.includes('i18n')) {
    return next(req).pipe(catchError(err => throwError(() => err)));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return handle401(req, next, authService, tokenService, notifications);
      }

      if (error.status === 403) {
        notifications.error('Access denied.');
      } else if (error.status === 0) {
        notifications.error('Cannot connect to server. Please try again.');
      } else if (error.status >= 500) {
        notifications.error('Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenService: TokenService,
  notifications: NotificationService
) {
  if (isRefreshing) {
    return refreshTokenSubject$.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
      )
    );
  }

  isRefreshing = true;
  refreshTokenSubject$.next(null);

  return authService.refreshToken().pipe(
    timeout(15_000),   // 15 s — if Railway is cold-starting, don't block forever
    switchMap(response => {
      isRefreshing = false;
      refreshTokenSubject$.next(response.accessToken);
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } }));
    }),
    catchError(err => {
      isRefreshing = false;
      refreshTokenSubject$.next(null);  // unblock any queued requests so they also fail fast
      authService.logout();
      notifications.error('Сесијата истече. Најавете се повторно.');
      return throwError(() => err);
    })
  );
}
