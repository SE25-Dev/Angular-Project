import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AssessmentsService, AssessmentResponse } from '../services/assessments.service';
import { Section } from '../models/section';
import { Assessment } from '../models/assessment';
import { StudentGradeComponent } from '../student-grade/student-grade.component';
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-session-assessments',
  standalone: true,
  imports: [CommonModule, MatIconModule, StudentGradeComponent],
  templateUrl: './session-assessments.component.html',
  styleUrl: './session-assessments.component.scss'
})
export class SessionAssessmentsComponent implements OnInit {
  @Input() courseId!: number;
  @Input() sessionId!: number;
  @Output() close = new EventEmitter<void>();

  sections: Section[] = [];
  assessmentsMap = new Map<number, Assessment>(); // Map UserId -> Assessment
  loading = true;

  constructor(private assessmentsService: AssessmentsService,
    private filesService: FilesService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.assessmentsService.getAssessmentsAndRaports(this.courseId, this.sessionId)
      .subscribe({
        next: (data: AssessmentResponse) => {
          this.sections = data.sections;
          // Create a quick lookup map for existing assessments
          data.assessments.forEach(a => this.assessmentsMap.set(a.userId, a));
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  downloadFile(file: any): void {
    this.filesService.downloadFileRaport(file.id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: file.type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => console.error('Error downloading file', err),
    });
  }

  getAssessmentForStudent(userId: number): Assessment | undefined {
    return this.assessmentsMap.get(userId);
  }

  getFileIcon(fileType: string | undefined): string {
    if (!fileType) return 'assets/icons/file.png';
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'assets/icons/pdf.png';
    if (type.includes('image')) return 'assets/icons/image.png';
    if (type.includes('word')) return 'assets/icons/doc.png';
    return 'assets/icons/file.png';
  }

  onSaveAssessment(assessmentData: Assessment, componentRef: StudentGradeComponent) {
    this.assessmentsService.saveAssessment(this.courseId, this.sessionId, assessmentData)
      .subscribe({
        next: (savedAssessment) => {
          this.assessmentsMap.set(savedAssessment.userId, savedAssessment);
          
          componentRef.onSaveSuccess(savedAssessment);
        },
        error: (err) => {
          console.error('Error saving grade:', err);
          componentRef.onSaveError();
        }
      });
  }
  
  // Helper to safely get users from section (handling potential undefined)
  getSectionUsers(section: Section): any[] {
    return section.users || [];
  }
}