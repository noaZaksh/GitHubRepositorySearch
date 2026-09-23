import {
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';
import {
  catchError,
  switchMap,
  throwError,
} from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const authService = inject(AuthService);

  const token = authService.getAccessToken();

  // Login and refresh requests do not need an access token.
  const isAuthRequest =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/refresh');

  let authReq = req;

  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Try to refresh the token only after 401.
      if (
        error.status === 401 &&
        !isAuthRequest &&
        localStorage.getItem('refresh_token')
      ) {
        return authService.refresh().pipe(
          switchMap(() => {
            const newToken =
              authService.getAccessToken();

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });

            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout();

            return throwError(
              () => refreshError,
            );
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};