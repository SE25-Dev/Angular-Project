import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course } from '../models/course'; // Import the new Course interface

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = environment.apiUrl;
  private _courses = new BehaviorSubject<Course[]>([]);
  public readonly courses$ = this._courses.asObservable();

  constructor(private http: HttpClient) { }

  loadCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`).pipe(
      tap(courses => this._courses.next(courses)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
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