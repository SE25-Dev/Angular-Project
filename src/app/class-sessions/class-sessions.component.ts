import { Component, Input, OnInit, OnChanges, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ClassSessionsService } from '../services/class-sessions.service';
import { ClassSession } from '../models/class-session';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { RaportsService } from '../services/raports.service';
import { CourseUser } from '../models/courseuser';
import { forkJoin, of } from 'rxjs';
import { FilesService } from '../services/files.service';
import { FileMeta } from '../models/filemeta';
import { ChangeDetectorRef } from '@angular/core';
import { SessionAssessmentsComponent } from '../session-assessments/session-assessments.component';
import { SessionPresenceComponent } from '../session-presence/session-presence.component';

@Component({
  selector: 'app-class-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SessionAssessmentsComponent,SessionPresenceComponent],
  templateUrl: './class-sessions.component.html',
  styleUrl: './class-sessions.component.scss',
})
export class ClassSessionsComponent implements OnInit, OnChanges {
  @Input() courseId!: number;
  classSessions: ClassSession[] = [];
  canEdit: boolean = false;

  // Session Creation
  showAddSessionModal = false;
  newSession = { topic: '', startingDateTime: '', endingDateTime: '', visible: true };

  // Raport Modal Data
  students: CourseUser[] = [];
  selectedStudentIds: number[] = [];
  description = '';
  selectedFiles: File[] = [];
  
  // Modal State
  showModal = false;
  currentSessionId!: number;
  
  // EDIT MODE STATE
  isEditingRaport = false;
  editingRaportId: number | null = null;
  existingFiles: FileMeta[] = [];
  deletedFileIds: number[] = [];

  showAssessmentModal = false;
  selectedSessionIdForAssessment!: number;
  showPresenceModal = false;
  selectedSessionIdForPresence!: number;

  constructor(
    private classSessionsService: ClassSessionsService,
    private auth: AuthService, // Using private here, but added getter below for template
    private filesService: FilesService,
    private coursesService: CoursesService,
    private raportsService: RaportsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    if (this.courseId) {
      this.coursesService.loadCourses().subscribe({
        next: (data) => this.loadCourse(),
      });
      this.loadSessions();
    }
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadSessions(): void {
    this.classSessionsService.getClassSessions(this.courseId).subscribe({
      next: (data) => {
        this.classSessions = data;
      },
      error: (err) => console.error('Error loading sessions', err),
    });
  }

  loadCourse(): void {
    this.coursesService.getCourseById(this.courseId).subscribe((course) => {
      if (!course) return;
      this.canEdit = this.auth.isUserTeacherInCourse(course);
    });
  }

  loadStudents(): void {
    this.coursesService.getUsersInCourse(this.courseId).subscribe({
      next: (users) =>
        (this.students = users.filter((u) => u.role === 'student')),
      error: (err) => console.error('Error fetching students', err),
    });
  }

  openAddSessionModal() { this.showAddSessionModal = true; }
  
  closeAddSessionModal() { 
      this.showAddSessionModal = false; 
      this.newSession = { topic: '', startingDateTime: '', endingDateTime: '', visible: true };
  }

  submitNewSession() {
      if (!this.newSession.topic || !this.newSession.startingDateTime || !this.newSession.endingDateTime) return;
      this.classSessionsService.createClassSession(this.courseId, this.newSession).subscribe({
        next: (session) => {
          this.classSessions.push(session);
          this.closeAddSessionModal();
          this.loadSessions();
        },
        error: (err) => console.error('Error creating session', err),
      });
  }


  openRaportModal(session: ClassSession) {
    this.currentSessionId = session.id;
    this.showModal = true;
    this.isEditingRaport = false;
    this.editingRaportId = null;
    this.description = '';
    this.selectedFiles = [];
    this.existingFiles = [];
    this.deletedFileIds = [];

    const currentUserId = this.auth.getCurrentUserId();

    if (currentUserId) {
      this.selectedStudentIds = [currentUserId];
    } else {
      this.selectedStudentIds = [];
    }
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files) as File[];
  }

  markFileForDeletion(fileId: number) {
    if (this.deletedFileIds.includes(fileId)) {
      // Undo deletion
      this.deletedFileIds = this.deletedFileIds.filter(id => id !== fileId);
    } else {
      // Mark for deletion
      this.deletedFileIds.push(fileId);
    }
  }

  toggleStudentSelection(userId: number): void {
    if (this.isEditingRaport) return; 

    if (this.selectedStudentIds.includes(userId)) {
      this.selectedStudentIds = this.selectedStudentIds.filter((id) => id !== userId);
    } else {
      this.selectedStudentIds.push(userId);
    }
  }

  closeRaportModal(): void {
    this.showModal = false;
    this.currentSessionId = 0;
    this.selectedStudentIds = [];
    this.description = '';
    this.selectedFiles = [];
    this.existingFiles = [];
    this.deletedFileIds = [];
    this.isEditingRaport = false;
  }

  openEditRaportModal(session: ClassSession) {
    if (!session.raport) return;

    this.currentSessionId = session.id;
    this.showModal = true;
    this.isEditingRaport = true;
    this.editingRaportId = session.raport.id;
    
    this.description = session.raport.description || '';
    
    
    this.existingFiles = session.raport.files ? [...session.raport.files] : [];
    
 
    console.log("Editing Raport Files:", this.existingFiles);

    this.selectedFiles = []; 
    this.deletedFileIds = [];
    if (session.raport.section && session.raport.section.users) {
        // @ts-ignore
        this.selectedStudentIds = session.raport.section.users.map((u: any) => u.id);
    }

    this.cdr.detectChanges();
  }

  // --- FIX 2: Correct Payload Keys in Submit ---
  submitRaport(): void {
    // Validation: Only require students if creating new
    if (!this.isEditingRaport && !this.selectedStudentIds.length) {
      alert('Please select at least one student.');
      return;
    }

    const uploadObservables = this.selectedFiles.length > 0 
        ? this.selectedFiles.map(f => this.filesService.uploadFile(f)) 
        : [of(null)];

    forkJoin(uploadObservables).subscribe({
        next: (responses) => {
            const newFileIds = responses
                .filter(r => r !== null)
                .map((r: any) => r.id);

            if (this.isEditingRaport && this.editingRaportId) {
                // --- UPDATE LOGIC ---
                this.raportsService.updateRaport(this.editingRaportId, {
                    description: this.description,
                    // Sending exact keys required by backend:
                    deletedFileIds: this.deletedFileIds, 
                    newFileIds: newFileIds               
                }).subscribe({
                    next: () => {
                        this.closeRaportModal();
                        this.loadSessions(); 
                    },
                    error: (err) => console.error("Error updating raport", err)
                });

            } else {
                // --- CREATE LOGIC ---
                this.raportsService.submitRaport(
                    this.currentSessionId,
                    this.description,
                    this.selectedStudentIds,
                    newFileIds
                ).subscribe({
                    next: () => {
                        this.closeRaportModal();
                        this.loadSessions();
                    },
                    error: (err) => console.error('Error submitting raport', err),
                });
            }
        },
        error: (err) => console.error('Error uploading files', err)
    });
  }

 getFileIcon(fileType: string | null | undefined): string {
    if (!fileType) return 'assets/icons/file.png';

    const type = fileType.toLowerCase();

    if (type.includes('pdf')) return 'assets/icons/pdf.png';
    else if (type.includes('image')) return 'assets/icons/image.png';
    else if (type.includes('word') || type.includes('document')) return 'assets/icons/doc.png';
    else if (type.includes('excel') || type.includes('sheet')) return 'assets/icons/xls.png';
    else if (type.includes('zip') || type.includes('rar')) return 'assets/icons/zip.png';
    else return 'assets/icons/file.png';
  }
  
  downloadFile(file: FileMeta): void {
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
  
  viewRaports(session: ClassSession) {
    this.selectedSessionIdForAssessment = session.id;
    this.showAssessmentModal = true;
  }
  
  closeAssessmentModal() {
    this.showAssessmentModal = false;
  }

  get currentUserId(): number | null {
    return this.auth.getCurrentUserId();
  }

  viewPresenceList(session: ClassSession) {
    this.selectedSessionIdForPresence = session.id;
    this.showPresenceModal = true;
  }
  
  closePresenceModal() {
    this.showPresenceModal = false;
  }
}