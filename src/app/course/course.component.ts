import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialsComponent } from '../materials/materials.component';
import { ClassSessionsComponent } from '../class-sessions/class-sessions.component';
import { CoursePermissionsComponent } from '../course-permissions/course-permissions.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsComponent,
    ClassSessionsComponent,
    CoursePermissionsComponent,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent implements OnInit {
  courseId!: number;
  showParticipants = false;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
