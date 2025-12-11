import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMaterials(courseId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/courses/${courseId}/materials`).pipe(
      catchError(this.handleError)
    );
  }

    uploadMaterial(
    courseId: number,
    materialData: { title: string; description: string; visible: boolean },
    fileIds: number[]
  ): Observable<any> {
    console.log(fileIds);
    return this.http.post(
      `${this.baseUrl}/courses/${courseId}/materials`,
      { ...materialData, fileIds }
    ).pipe(
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