import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

import { TokenResponse } from '../models/token-response';
import { TokenPayload } from '../models/token-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('userToken');
    }
    return this.token;
  }

  public getUserDetails(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded: any = JSON.parse(atob(payload));
      console.log('Decoded JWT:', decoded); // <--- check if exp exists
      return decoded as TokenPayload;
    } catch (err) {
      return null;
    }
  }

  // -------- API CALLS --------

  public register(data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email?: string;
  }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.baseUrl}/auth/register`, data)
      .pipe(
        map((res) => {
          if (res.token) this.saveToken(res.token);
          return res;
        }),
      );
  }

  public login(username: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        map((res) => {
          console.log(res);
          if (res.token) this.saveToken(res.token);
          return res;
        }),
      );
  }

  public updateToken(): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.baseUrl}/auth/update_token`, {})
      .pipe(
        map((res) => {
          if (res.token) this.saveToken(res.token);

          return res;
        }),
      );
  }

  public logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe();
    }

    this.token = null;
    localStorage.removeItem('userToken');
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('userToken');
    if (!token) return false;

    try {
      // Fix Base64URL
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if necessary
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );

      const payload = JSON.parse(atob(padded)); // atob does not handle utf-8
      if (isDevMode()) {
        console.log('Decoded payload:', payload);
      }

      return payload.exp && Number(payload.exp) > Date.now() / 1000;
    } catch (err) {
      console.error('Token decode error:', err);
      return false;
    }
  }
}
