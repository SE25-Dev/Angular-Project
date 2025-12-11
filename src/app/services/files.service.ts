import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FileMeta } from '../models/filemeta';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<FileMeta> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<FileMeta>(`${this.baseUrl}/files/upload`, formData)
    .pipe(catchError(this.handleError));
    }

    downloadFileMaterial(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/download/${fileId}`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }
  downloadFileRaport(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/download-raport/${fileId}`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error: any): Observable<never> {
    const msg = error.error?.message || 'File upload failed';
    console.error(msg);
    return throwError(() => new Error(msg));
  }
}