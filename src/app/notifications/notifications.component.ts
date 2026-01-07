import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private notificationsSubscription: Subscription | undefined;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe(); 
    this.notificationsSubscription = this.notificationsService.notifications$.subscribe(
      data => {
        this.notifications = data
          .filter(n => !n.isRead) 
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    );
  }

  ngOnDestroy(): void {
    this.notificationsSubscription?.unsubscribe();
  }

  acceptInvitation(notification: Notification): void {
    this.notificationsService.markAsRead(notification.id, 'accept').subscribe({
      next: () => {
        if (isDevMode()) console.log('Invitation accepted:', notification);
    
        this.removeNotificationFromList(notification.id);
      },
      error: (err) => {
        if (isDevMode()) console.error('Failed to accept:', err);
      }
    });
  }

  rejectInvitation(notification: Notification): void {
    this.notificationsService.markAsRead(notification.id, 'deny').subscribe({
      next: () => {
        if (isDevMode()) console.log('Invitation denied:', notification);
        this.removeNotificationFromList(notification.id);
      },
      error: (err) => {
        if (isDevMode()) console.error('Failed to deny:', err);
      }
    });
  }
  private removeNotificationFromList(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  markAsRead(notification: Notification): void {
     this.notificationsService.markAsRead(notification.id, 'read').subscribe({
        next: () => this.removeNotificationFromList(notification.id)
     });
  }
}