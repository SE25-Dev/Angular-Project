import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassSessionsService } from '../services/class-sessions.service';
import { ClassSession } from '../models/class-session';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';
import { CoursesService } from '../services/courses.service';
import { RaportsService } from '../services/raports.service';
import { CourseUser } from '../models/courseuser';
import { forkJoin } from 'rxjs';
import { FilesService } from '../services/files.service';
import { FileMeta } from '../models/filemeta';

@Component({
  selector: 'app-class-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-sessions.component.html',
  styleUrl: './class-sessions.component.scss'
})
export class ClassSessionsComponent implements OnInit, OnChanges {

  @Input() courseId!: number;
  classSessions: ClassSession[] = [];
  canEdit: boolean = false;

  showAddSessionModal = false;
  newSession = { topic: '', startingDateTime: '', endingDateTime: '', visible: true };
  students: CourseUser[] = [];
  selectedStudentIds: number[] = [];
  description = '';
  selectedFiles: File[] = [];
  canSubmit = false;
  showModal = false;
  currentSessionId!: number; 

  constructor(
    private classSessionsService: ClassSessionsService,
    private auth: AuthService,
    private filesService: FilesService,
    private coursesService: CoursesService,
    private raportsService: RaportsService
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

  // Teacher / Headteacher actions
  viewRaports(session: any) {
    this.raportsService.getRaports(session.id).subscribe({
      next: raports => console.log(raports),
      error: err => console.error(err)
    });
  }

  viewPresenceList(session: any) {
    // this.presenceService.getPresence(session.id).subscribe({
    //   next: presence => console.log(presence),
    //   error: err => console.error(err)
    // });
  }

  loadSessions(): void {
    this.classSessionsService.getClassSessions(this.courseId).subscribe({
      next: (data) => {
        this.classSessions = data;
        console.log(this.classSessions);},
      error: (err) => console.error("Error loading sessions", err)
    });
  }

    loadCourse(): void {

    this.coursesService.getCourseById(this.courseId).subscribe(course => {
      if (!course) {
        console.error(`Course with id ${this.courseId} not found`);
        return;
      }
      console.log(course);
      this.canEdit = this.auth.isUserTeacherInCourse(course);
    });
  }
    openRaportModal(session: ClassSession) {
    this.currentSessionId = session.id;
    this.showModal = true;
    this.description = '';
    this.selectedFiles = [];

    const currentUserId = this.auth.getCurrentUserId(); // method from AuthService

    // Automatically include uploader
    if(currentUserId){
    this.selectedStudentIds = [currentUserId];
    }
    else{
      this.selectedStudentIds = [];
    }


    // Exclude uploader from checkbox list
    this.students = this.students.filter(s => s.userId !== currentUserId);
  }


  openAddSessionModal() {
    this.showAddSessionModal = true;
  }

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
      error: (err) => console.error("Error creating session", err)
    });
  }
   loadStudents(): void {
    this.coursesService.getUsersInCourse(this.courseId).subscribe({
      next: (users) => this.students = users.filter(u => u.role === 'student'),
      error: (err) => console.error('Error fetching students', err)
    });
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files) as File[];
  }

  // Student selects/deselects other students
  toggleStudentSelection(userId: number): void {
    if (this.selectedStudentIds.includes(userId)) {
      this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== userId);
    } else {
      this.selectedStudentIds.push(userId);
    }
  }

  // Submit raport with files
  submitRaport(): void {
    if (!this.selectedStudentIds.length) {
      alert('Please select at least one student.');
      return;
    }

    if (!this.currentSessionId) {
      console.error('No session selected for raport.');
      return;
    }

    if (!this.selectedFiles.length) {
      // no files, just submit raport
      this.raportsService.submitRaport(this.currentSessionId, this.description, this.selectedStudentIds, [])
        .subscribe({
          next: () => this.closeRaportModal(),
          error: err => console.error(err)
        });
      return;
    }

    // Step 1: upload all files
    const uploadRequests = this.selectedFiles.map(file => this.filesService.uploadFile(file));

    forkJoin(uploadRequests).subscribe({
      next: (responses) => {
        const fileIds = responses.map(f => f.id);
        // Step 2: submit raport with uploaded file IDs
        this.raportsService.submitRaport(this.currentSessionId, this.description, this.selectedStudentIds, fileIds)
          .subscribe({
            next: () => this.closeRaportModal(),
            error: err => console.error('Error submitting raport', err)
          });
      },
      error: (err) => console.error('Error uploading files', err)
    });
  }


    closeRaportModal(): void {
      this.showModal = false;
      this.currentSessionId = 0;
      this.selectedStudentIds = [];
      this.description = '';
      this.selectedFiles = [];
    }
    
  getFileIcon(fileType: string): string {console.log('fileType:', fileType);
    if (fileType.includes('pdf')) {
      return 'assets/icons/pdf.png';
    } else if (fileType.includes('image')) {
      return 'assets/icons/image.png';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'assets/icons/doc.png';
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return 'assets/icons/xls.png';
    } else if (fileType.includes('zip') || fileType.includes('rar')) {
      return 'assets/icons/zip.png';
    } else {
      return 'assets/icons/file.png';
    }
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
        error: (err) => {
          console.error('Error downloading file', err);
        }
      });
    }
}