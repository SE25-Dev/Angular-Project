import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { TokenResponse } from '../models/token-response';
import { TokenPayload } from '../models/token-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  private saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  private getToken(): string | null {
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
      const decoded = JSON.parse(atob(payload));
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
    return this.http.post<TokenResponse>('/auth/register', data).pipe(
      map((res) => {
        if (res.token) this.saveToken(res.token);
        return res;
      })
    );
  }

  public login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/auth/login', { username, password }).pipe(
      map((res) => {
        if (res.token) this.saveToken(res.token);
        return res;
      })
    );
  }

  public updateToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/auth/update_token', {}).pipe(
      map((res) => {
        if (res.token) this.saveToken(res.token);
        return res;
      })
    );
  }

  public logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post('/auth/logout', {}).subscribe();
    }

    this.token = null;
    localStorage.removeItem('userToken');
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (!user) return false;

    return user.exp > Date.now() / 1000;
  }
}