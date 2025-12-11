import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course } from '../models/course'; // Import the new Course interface
import { forkJoin } from 'rxjs';
import { CourseUser } from '../models/courseuser';
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private baseUrl = environment.apiUrl;
  private _courses = new BehaviorSubject<Course[]>([]);
  public readonly courses$ = this._courses.asObservable();

  constructor(private http: HttpClient) { }

  loadCourses(): Observable<Course[]> {
    return forkJoin({
      courses: this.http.get<Course[]>(`${this.baseUrl}/courses`),
      enrolledIds: this.getEnrolledCourses()
    }).pipe(
      map(({ courses, enrolledIds }) => {
        return courses.map(c => ({
          ...c,
          isUserEnrolled: enrolledIds.includes(Number(c.id)),
        }));
      }),
      tap(updated => this._courses.next(updated)),
      catchError(this.handleError)
    );
  }

 getUsersInCourse(courseId: number): Observable<CourseUser[]> {
    return this.http.get<CourseUser[]>(`${this.baseUrl}/courses/${courseId}/users`).pipe(
      catchError(this.handleError)
    );
  }
 updateUserRole(courseId: number, userId: number, newRole: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/courses/${courseId}/users/${userId}/role`, { newRole: newRole }).pipe(
    catchError(this.handleError)
  );
 } 

  getEnrolledCourses(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/courses/my_courses`).pipe(
      catchError(this.handleError)
    );
  }

  enroll(courseId: number, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/${courseId}/enroll`, { password })
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: number): Observable<Course | undefined> {
    const course = this._courses.getValue().find(c => c.id === id);
    return of(course);
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