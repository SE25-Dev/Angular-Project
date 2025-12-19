import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = environment.apiUrl;
  // Note: Ensure your backend route prefix matches (e.g., if your router is mounted at /api, this should be correct)
  // Based on your snippet: notifications_router.put("/notifications/:id/mark_as_read")
  
  private _notifications = new BehaviorSubject<Notification[]>([]);
  public readonly notifications$ = this._notifications.asObservable();

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`).pipe(
      tap(notifs => this._notifications.next(notifs)),
      catchError(this.handleError)
    );
  }

  // Unified method for Reading, Accepting, or Denying
  markAsRead(notificationId: number, action: 'read' | 'accept' | 'deny' = 'read'): Observable<any> {
    const body = { action: action };
    
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/mark_as_read`, body).pipe(
      tap(() => {
        // Refresh the list to remove the handled notification
        this.getNotifications().subscribe(); 
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
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