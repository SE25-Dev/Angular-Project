import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Assessment } from '../models/assessment';
import { Section } from '../models/section';

export interface AssessmentResponse {
  assessments: Assessment[];
  sections: Section[];
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch assessments and raports for a specific session
  getAssessmentsAndRaports(courseId: number, sessionId: number): Observable<AssessmentResponse> {
    return this.http.get<AssessmentResponse>(
      `${this.baseUrl}/courses/${courseId}/class_sessions/${sessionId}/assessments_and_raports`
    ).pipe(catchError(this.handleError));
  }

  saveAssessment(courseId: number, classSessionId: number, assessment: Assessment): Observable<Assessment> {
    return this.http.put<Assessment>(
      `${this.baseUrl}/courses/${courseId}/class_sessions/${classSessionId}/assessments`, 
      assessment
    ).pipe(catchError(this.handleError));
  }
  
  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'Server Error';
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}