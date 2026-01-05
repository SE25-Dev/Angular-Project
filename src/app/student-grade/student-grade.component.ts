import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CourseUser } from '../models/courseuser';
import { Assessment } from '../models/assessment';
import { AssessmentsService } from '../services/assessments.service';

@Component({
  selector: 'app-student-grade',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="grade-row">
      <div class="student-info">
        <span class="name">{{ student.firstName }} {{ student.lastName }}</span>
        <span class="username">({{ student.username }})</span>
      </div>

      <div class="inputs">
        <input 
         class="grade-input" 
          type="number" 
          placeholder="0-5" 
          min="0"
          max="5"
          step="0.5"
          [(ngModel)]="grade"
          (ngModelChange)="validateGrade()" 
          (keyup.enter)="triggerSave()"
          [class.saved]="isSaved"
          [class.invalid]="isInvalid"
        />
        <input 
        class="feedback-input" 
        type="text" 
        placeholder="Optional Feedback" 
        [(ngModel)]="feedback" 
        (keyup.enter)="triggerSave()"
      />
        </div>

      <button 
        class="save-btn" 
        (click)="triggerSave()" 
        [disabled]="loading" 
        [class.success]="isSaved">
        <mat-icon>{{ isSaved ? 'check' : 'save' }}</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .grade-row {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background 0.2s;
    }
    .grade-input.invalid { 
      border-color: #ff6b6b; 
      color: #ff6b6b; 
      background: rgba(255, 107, 107, 0.1);
    }
    
    .error-text { 
      color: #ff6b6b; 
      font-size: 11px; 
      margin-left: 10px; 
      margin-top: -4px;
      margin-bottom: 8px;
    }
        .feedback-input {
        flex: 1; 
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        padding: 8px;
        color: white;
        font-family: inherit;
        min-width: 120px;
      }
      
      .feedback-input:focus {
        outline: none;
        border-color: #16d4c3;
      }
    .grade-row:hover {
      background: rgba(255, 255, 255, 0.07);
    }
    .student-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .name { font-weight: 600; color: white; font-size: 14px; }
    .username { font-size: 12px; color: rgba(255,255,255,0.6); }
    
    .inputs { display: flex; gap: 10px; flex: 2; }
    
    input {
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      padding: 8px;
      color: white;
      font-family: inherit;
    }
    input:focus { outline: none; border-color: #16d4c3; }
    .grade-input { width: 80px; text-align: center; }
    .grade-input.saved { border-color: #16d4c3; color: #16d4c3; font-weight: bold; }
    .feedback-input { flex: 1; }

    .save-btn {
      background: #16d4c3;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }
    .save-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
    .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .save-btn.success { background: #00b894; }
    .save-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class StudentGradeComponent implements OnInit {
 @Input() student!: CourseUser;
  @Input() assessment?: Assessment; 
  @Input() classSessionId!: number;
  @Output() save = new EventEmitter<Assessment>();
  
  grade: number | null = 0; // Initialize to 0 or null
  feedback: string = '';
  loading = false;
  isSaved = false;
  isInvalid = false;

  constructor(private assessmentsService: AssessmentsService) {}

  ngOnInit() {
    if (this.assessment) {
      this.grade = this.assessment.grade;
      this.feedback = this.assessment.feedback || '';
      this.isSaved = true;
    }
  }

  validateGrade() {
    if (this.grade === null) {
      this.isInvalid = false;
      return;
    }

    // 1. Check Range (0-5)
    const inRange = this.grade >= 0 && this.grade <= 5;
    
    // 2. Check Step (Divisible by 0.5)
    // We use a small epsilon for floating point comparison safety
    const isStepValid = (this.grade * 10) % 5 === 0; 

    if (!inRange || !isStepValid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }

  triggerSave() {
    if (this.grade === null) return;
    
    // Ensure validation runs before saving
    this.validateGrade();

    if (this.isInvalid) return;

    this.loading = true;
    this.isSaved = false;

    const payload: Assessment = {
      id: this.assessment?.id,
      classSessionId: this.classSessionId,
      userId: (this.student as any).id || this.student.userId,
      grade: this.grade,
      feedback: this.feedback
    };

    this.save.emit(payload);
  }

  onSaveSuccess(updatedAssessment: Assessment) {
    this.assessment = updatedAssessment;
    this.loading = false;
    this.isSaved = true;
  }

  onSaveError() {
    this.loading = false;
    this.isSaved = false;
  }
}