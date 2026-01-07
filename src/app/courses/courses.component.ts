import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Ensure you have this for the search icon
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
  private allCourses: Course[] = []; 
  courses: Course[] = []; 
  
  isSuperuser = false;
  private coursesSubscription?: Subscription;
  
  searchTerm: string = '';

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
      // 1. Store original data
      // 2. Sort alphabetically by default
      this.allCourses = c.sort((a, b) => a.title.localeCompare(b.title));
      
      this.filterCourses();
    });

    this.coursesService.loadCourses().subscribe();
  }

  filterCourses(): void {
    if (!this.searchTerm) {
      this.courses = [...this.allCourses];
      return;
    }

    const term = this.searchTerm.toLowerCase();

    // Primary Search: Filter by Course Title
    const titleMatches = this.allCourses.filter(course => 
      course.title.toLowerCase().includes(term)
    );
    if (titleMatches.length > 0) {
      this.courses = titleMatches;
    } else {
      // Secondary Search: If NO titles matched, search by Teacher Name
      this.courses = this.allCourses.filter(course => 
  
        course.teachers.some(teacher => 
          teacher.firstName.toLowerCase().includes(term) || 
          teacher.lastName.toLowerCase().includes(term)
        )
      );
    }
  }

  onActionClick(event: Event, course: Course): void {
    event.stopPropagation();

    if (course.isUserEnrolled) {
      window.location.href = `/course/${course.id}`;
      return;
    }

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