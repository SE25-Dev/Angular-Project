import { Component, Input } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-permissions.component.html',
  styleUrl: './course-permissions.component.scss'
})
export class CoursePermissionsComponent {
  @Input() courseId!: number;
   users: any[] = [];
  canEdit: boolean = false;
  roles = ['student', 'teacher', 'headteacher'];

  constructor(
    private coursesService: CoursesService,
    private auth: AuthService
  ) {}

  ngOnChanges(): void {
    if (this.courseId) {
      this.loadCourse();
      this.getUsersInCourse();
    }
  }

  loadCourse(): void {
    this.coursesService.getCourseById(this.courseId).subscribe(course => {
      if (!course) {
        console.error(`Course with id ${this.courseId} not found`);
        return;
      }
      this.canEdit = this.auth.isUserTeacherInCourse(course);
    });
  }

  getUsersInCourse(): void {
    this.coursesService.getUsersInCourse(this.courseId).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Error fetching users', err)
    });
  }

    changeRole(user: any, newRole: string): void {
    if (!this.canEdit || !user) return;
    console.log(newRole);
    this.coursesService.updateUserRole(this.courseId, user.userId, newRole).subscribe({
      next: () => user.role = newRole,
      error: (err) => console.error('Error updating role', err)
    });
  }

}
