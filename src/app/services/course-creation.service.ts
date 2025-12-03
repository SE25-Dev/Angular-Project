import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseCreationRequest } from '../models/course-creation-request';

@Injectable({
  providedIn: 'root'
})
export class CourseCreationService {
  private baseUrl = environment.apiUrl;
  private _courseCreationRequests = new BehaviorSubject<CourseCreationRequest[]>([]);
  public readonly courseCreationRequests$ = this._courseCreationRequests.asObservable();

  constructor(private http: HttpClient) { }

  createCourseRequest(data: { title: string; description: string; coursePassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/course_creation_request`, {
      title: data.title,
      description: data.description,
      coursePassword: data.coursePassword,
    }).pipe(
      catchError(this.handleError)
    );
  }

  getCourseCreationRequests(): Observable<CourseCreationRequest[]> {
    return this.http.get<CourseCreationRequest[]>(`${this.baseUrl}/courses/course_creation_requests`).pipe(
      tap(requests => this._courseCreationRequests.next(requests)),
      catchError(this.handleError)
    );
  }

  acceptOrRejectCourseRequest(requestId: number, action: 'accept' | 'reject'): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/course_creation_request/${requestId}`, { action }).pipe(
      tap(() => this.getCourseCreationRequests().subscribe()), // Refresh the list after action
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}