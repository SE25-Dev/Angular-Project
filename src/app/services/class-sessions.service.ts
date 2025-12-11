import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ClassSession } from '../models/class-session';

@Injectable({
  providedIn: 'root'
})
export class ClassSessionsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getClassSessions(courseId: number): Observable<ClassSession[]> {
    return this.http.get<ClassSession[]>(`${this.baseUrl}/courses/${courseId}/classsessions`).pipe(
      catchError(this.handleError)
    );
  }

  createClassSession(courseId: number, sessionData: { topic: string; startingDateTime: string; endingDateTime: string; visible: boolean; }): Observable<ClassSession> {
    return this.http.post<ClassSession>(`${this.baseUrl}/courses/create_class_session`, {
      courseId,
      ...sessionData
    }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}