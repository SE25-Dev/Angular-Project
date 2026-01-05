import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { PresenceService } from '../services/presence.service';
import { CourseUser } from '../models/courseuser';

interface StudentPresenceRow {
  student: CourseUser;
  present: boolean;
  isModified: boolean;
}

@Component({
  selector: 'app-session-presence',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './session-presence.component.html',
  styleUrl: './session-presence.component.scss'
})
export class SessionPresenceComponent implements OnInit {
  @Input() courseId!: number;
  @Input() sessionId!: number;
  @Output() close = new EventEmitter<void>();

  students: StudentPresenceRow[] = [];
  loading = true;
  saving = false;

  constructor(
    private coursesService: CoursesService,
    private presenceService: PresenceService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    forkJoin({
      allStudents: this.coursesService.getUsersInCourse(this.courseId),
      presenceRecords: this.presenceService.getPresence(this.courseId, this.sessionId)
    }).subscribe({
      next: ({ allStudents, presenceRecords }) => {
        const studentUsers = allStudents.filter(u => u.role === 'student');

        const presenceMap = new Map<number, boolean>();
        presenceRecords.forEach(p => presenceMap.set(p.userId, p.present));

        this.students = studentUsers.map(student => ({
          student: student,
          present: presenceMap.has(student.userId) ? presenceMap.get(student.userId)! : false, 
          isModified: false
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading presence data', err);
        this.loading = false;
      }
    });
  }

  togglePresence(row: StudentPresenceRow) {
    row.present = !row.present;
    row.isModified = true;
  }

  markAll(present: boolean) {
    this.students.forEach(row => {
      if (row.present !== present) {
        row.present = present;
        row.isModified = true;
      }
    });
  }

  save() {
    this.saving = true;

    const payload = this.students.map(row => ({
      userId: row.student.userId,
      present: row.present
    }));

    this.presenceService.updatePresence(this.courseId, this.sessionId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.close.emit(); // Close modal on success
      },
      error: (err) => {
        console.error('Error saving presence', err);
        this.saving = false;
      }
    });
  }
}