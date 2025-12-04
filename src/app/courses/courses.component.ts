import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  isSuperuser: boolean = false;
  private coursesSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private coursesService: CoursesService) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.isSuperuser = userDetails.superuser;
    }

    this.coursesSubscription = this.coursesService.courses$.subscribe((courses) => {
      this.courses = courses;
    });
    this.coursesService.loadCourses().subscribe();
  }

  ngOnDestroy(): void {
    this.coursesSubscription?.unsubscribe();
  }
}
