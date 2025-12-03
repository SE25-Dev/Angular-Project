import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseCreationService } from '../services/course-creation.service';

@Component({
  selector: 'app-course-request-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-request-creator.component.html',
  styleUrl: './course-request-creator.component.scss'
})
export class CourseRequestCreatorComponent {
  title: string = '';
  description: string = '';
  password: string = ''; // This might be used for course-specific access or a creator's password
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private courseCreationService: CourseCreationService) {}

  createCourseRequest() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title || !this.description || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.courseCreationService.createCourseRequest({
      title: this.title,
      description: this.description,
      coursePassword: this.password,
    }).subscribe({
      next: () => {
        this.successMessage = 'Course request submitted successfully!';
        this.router.navigate(['/courses']); // Redirect to courses list or a confirmation page
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit course request.';
        console.error(err);
      }
    });
  }
}
