import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Raport {
  id: number;
  sessionId: number;
  userId: number;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RaportsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all raports for a session
  getRaports(sessionId: number): Observable<Raport[]> {
    return this.http.get<Raport[]>(`${this.baseUrl}/sessions/${sessionId}/raports`).pipe(
      catchError(this.handleError)
    );
  }

  submitRaport(classSessionId: number, description: string, userIds: number[], fileIds: number[]): Observable<Raport> {
    return this.http.post<Raport>(`${this.baseUrl}/courses/${classSessionId}/submit_raport`, {
      description,
      userIds,
      fileIds
    }).pipe(catchError(this.handleError));
  }

  updateRaport(raportId: number, data: { description: string, deletedFileIds: number[], newFileIds: number[] }): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/${raportId}/edit_raport`, data);
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}