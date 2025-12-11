import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  isSuperuser = false;
  private coursesSubscription?: Subscription;

  showModal = false;
  enteredPassword = '';
  courseToEnroll: Course | null = null;

  constructor(private authService: AuthService,
              private coursesService: CoursesService) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.isSuperuser = userDetails.superuser;
    }

    this.coursesSubscription = this.coursesService.courses$.subscribe(c => {
      this.courses = c;
    });

    this.coursesService.loadCourses().subscribe();
  }

  onActionClick(event: Event, course: Course): void {
    event.stopPropagation();

    if (course.isUserEnrolled) {
      window.location.href = `/course/${course.id}`;
      return;
    }

    // Open modal
    this.courseToEnroll = course;
    this.enteredPassword = '';
    this.showModal = true;
  }

  confirmEnroll() {
    if (!this.courseToEnroll) return;

    this.coursesService.enroll(this.courseToEnroll.id, this.enteredPassword)
      .subscribe({
        next: () => {
          this.showModal = false;
          alert('Successfully enrolled!');
          this.coursesService.loadCourses().subscribe();
        },
        error: (err) => alert('Enrollment failed: ' + err.message)
      });
  }

  closeModal() {
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.coursesSubscription?.unsubscribe();
  }
}