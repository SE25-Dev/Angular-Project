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
        // Sort by newest first
        this.notifications = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.notificationsSubscription?.unsubscribe();
  }

  acceptInvitation(notification: Notification): void {
    // FIXED: Use markAsRead with 'accept'
    this.notificationsService.markAsRead(notification.id, 'accept').subscribe({
      next: () => {
        if (isDevMode()) console.log('Invitation accepted:', notification);
      },
      error: (err) => {
        if (isDevMode()) console.error('Failed to accept:', err);
      }
    });
  }

  rejectInvitation(notification: Notification): void {
    // FIXED: Use markAsRead with 'deny' (Changed from 'reject' to match Service/Backend)
    this.notificationsService.markAsRead(notification.id, 'deny').subscribe({
      next: () => {
        if (isDevMode()) console.log('Invitation denied:', notification);
      },
      error: (err) => {
        if (isDevMode()) console.error('Failed to deny:', err);
      }
    });
  }
  
  // Optional: Helper to clear "Info" notifications manually if you add a button later
  markAsRead(notification: Notification): void {
     this.notificationsService.markAsRead(notification.id, 'read').subscribe();
  }
}