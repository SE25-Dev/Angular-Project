import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  courses = [
    { title: 'Angular Basics', duration: 'one semester', status: 'active' },
    {
      title: 'Sofware engeneering',
      duration: 'one semester',
      status: 'active',
    },
    { title: 'Data bases', duration: 'one semester', status: 'inactive' },

    {
      title: 'Laravel API Development',
      duration: 'one semester',
      status: 'active',
    },
    { title: 'React Fundamentals', duration: 'one semester', status: 'active' },
    { title: 'Java Spring Boot', duration: 'one semester', status: 'inactive' },
  ];
}
