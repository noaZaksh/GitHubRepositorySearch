import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  readonly isLoggedIn = signal(
    !!localStorage.getItem(this.accessTokenKey),
  );

  login(
    username: string,
    password: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/api/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            this.accessTokenKey,
            response.accessToken,
          );

          localStorage.setItem(
            this.refreshTokenKey,
            response.refreshToken,
          );

          this.isLoggedIn.set(true);
        }),
      );
  }

  refresh(): Observable<{ accessToken: string }> {
    const refreshToken =
      localStorage.getItem(this.refreshTokenKey);

    return this.http
      .post<{ accessToken: string }>(
        `${this.baseUrl}/api/auth/refresh`,
        {
          refreshToken,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            this.accessTokenKey,
            response.accessToken,
          );
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);

    this.isLoggedIn.set(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
}