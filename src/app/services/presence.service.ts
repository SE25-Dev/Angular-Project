import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Presence } from '../models/presence';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch existing presence records
  getPresence(courseId: number, sessionId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(
      `${this.baseUrl}/courses/${courseId}/class_sessions/${sessionId}/presence`
    ).pipe(catchError(this.handleError));
  }

  // Bulk update presence
  updatePresence(
    courseId: number, 
    sessionId: number, 
    records: { userId: number; present: boolean }[]
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/courses/${courseId}/class_sessions/${sessionId}/presence`, 
      { records }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'Server Error';
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}