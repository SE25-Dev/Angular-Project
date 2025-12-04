import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
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

  isSuperuser: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.isSuperuser = userDetails.superuser;
    }
  }
}
