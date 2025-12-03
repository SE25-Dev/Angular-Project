import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseCreationService } from '../services/course-creation.service';
import { CourseCreationRequest } from '../models/course-creation-request';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-creation-requests',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './course-creation-requests.component.html',
  styleUrl: './course-creation-requests.component.scss'
})
export class CourseCreationRequestsComponent implements OnInit, OnDestroy {
  courseRequests: CourseCreationRequest[] = [];
  private courseRequestsSubscription: Subscription | undefined;

  constructor(private courseCreationService: CourseCreationService) {}

  ngOnInit(): void {
    this.courseCreationService.getCourseCreationRequests().subscribe(); // Fetch initial requests
    this.courseRequestsSubscription = this.courseCreationService.courseCreationRequests$.subscribe(
      requests => {
        this.courseRequests = requests;
      }
    );
  }

  ngOnDestroy(): void {
    this.courseRequestsSubscription?.unsubscribe();
  }

  acceptRequest(request: CourseCreationRequest): void {
    if (request.id) {
      this.courseCreationService.acceptOrRejectCourseRequest(request.id, 'accept').subscribe({
        next: () => {
          if (isDevMode()) {
            console.log('Request accepted:', request);
          }
          // The service's tap operator will refresh the list
        },
        error: (err) => {
          if (isDevMode()) {
            console.error('Failed to accept request:', err);
          }
        }
      });
    }
  }

  rejectRequest(request: CourseCreationRequest): void {
    if (request.id) {
      this.courseCreationService.acceptOrRejectCourseRequest(request.id, 'reject').subscribe({
        next: () => {
          if (isDevMode()) {
            console.log('Request rejected:', request);
          }
          // The service's tap operator will refresh the list
        },
        error: (err) => {
          if (isDevMode()) {
            console.error('Failed to reject request:', err);
          }
        }
      });
    }
  }
}
