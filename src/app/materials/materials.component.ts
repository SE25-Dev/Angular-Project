import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaterialsService } from '../services/materials.service';
import { Material, MaterialData, MaterialUpdateData } from '../models/material';
import { FileMeta } from '../models/filemeta';
import { Course } from '../models/course';
import { CoursesService } from '../services/courses.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { filter, forkJoin } from 'rxjs';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent implements OnInit {
  @Input() courseId!: number;

  materials: Material[] = [];
  course!: Course;
  canEdit: boolean = false;
  showAddModal = false;
  newMaterial: MaterialData = { title: '', description: '', visible: true };
  selectedFiles = [] as File[];
  showEditModal = false;
  editingMaterial: Material | null = null;
  editMaterialData: MaterialUpdateData = {};
  editSelectedFiles: File[] = [];
  deletedFileIds: number[] = [];

  constructor(
    private filesService: FilesService,
    private materialsService: MaterialsService,
    private coursesService: CoursesService,
    private auth: AuthService,
  ) {}

  ngOnChanges(): void {
    if (this.courseId) {
      this.coursesService.loadCourses().subscribe({
        next: (data) => this.loadCourse(),
      });
      this.loadMaterials();
    }
  }

  ngOnInit(): void {}

  loadMaterials(): void {
    this.materialsService.getMaterials(this.courseId).subscribe({
      next: (data) => {
        this.materials = data;
        if (isDevMode()) {
          console.log(this.materials);
        }
      },
      error: (err) => console.error('Error fetching materials', err),
    });
  }

  downloadFile(file: FileMeta): void {
    this.filesService.downloadFileMaterial(file.id).subscribe({
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
      },
    });
  }

  openAddMaterialModal() {
    this.showAddModal = true;
  }

  closeAddMaterialModal(event?: any) {
    if (isDevMode()) {
      console.log(event);
    }
    this.showAddModal = false;
    this.newMaterial = { title: '', description: '', visible: true };
    this.selectedFiles = [];
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files) as File[];
  }

  submitNewMaterial() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      return this.createMaterial([]); // no files
    }

    const uploadRequests = this.selectedFiles.map((file) =>
      this.filesService.uploadFile(file),
    );

    forkJoin(uploadRequests).subscribe({
      next: (responses) => {
        if (isDevMode()) {
          console.log(responses);
        }
        const fileIds = responses.map((r) => r.id);
        this.createMaterial(fileIds);
      },
      error: (err) => console.error('Error uploading files', err),
    });
  }

  openEditMaterialModal(material: Material) {
    this.editingMaterial = material;
    this.editMaterialData = {
      title: material.title,
      description: material.description,
      visible: material.visible,
    };
    this.editSelectedFiles = [];
    this.deletedFileIds = [];
    this.showEditModal = true;
  }

  closeEditMaterialModal() {
    this.showEditModal = false;
    this.editingMaterial = null;
    this.editMaterialData = { title: '', description: '', visible: true };
    this.editSelectedFiles = [];
    this.deletedFileIds = [];
  }

  onEditFilesSelected(event: any) {
    this.editSelectedFiles = Array.from(event.target.files) as File[];
  }

  markFileForDeletion(fileId: number) {
    if (!this.deletedFileIds.includes(fileId)) {
      this.deletedFileIds.push(fileId);
    }
  }

  submitEditedMaterial() {
    if (!this.editingMaterial) return;

    if (this.editSelectedFiles.length === 0) {
      return this.updateMaterial([]);
    }

    const uploadRequests = this.editSelectedFiles.map((file) =>
      this.filesService.uploadFile(file),
    );

    forkJoin(uploadRequests).subscribe({
      next: (responses) => {
        if (isDevMode()) {
          console.log(responses);
        }
        const fileIds = responses.map((r) => r.id);
        this.updateMaterial(fileIds);
      },
      error: (err) => console.error('Error uploading files', err),
    });
  }

  private updateMaterial(newFileIds: number[]) {
    if (!this.editingMaterial) return;

    const updateData = {
      ...this.editMaterialData,
      deletedFileIds: this.deletedFileIds,
      newFileIds: newFileIds,
    };

    this.materialsService
      .updateMaterial(this.courseId, this.editingMaterial.id, updateData)
      .subscribe({
        next: () => {
          this.closeEditMaterialModal();
          this.loadMaterials();
        },
        error: (err) => console.error('Error updating material', err),
      });
  }
  private createMaterial(fileIds: number[]) {
    this.materialsService
      .uploadMaterial(this.courseId, this.newMaterial, fileIds)
      .subscribe({
        next: () => {
          this.closeAddMaterialModal();
          this.loadMaterials();
        },
        error: (err) => console.error('Error creating material', err),
      });
  }

  deleteMeterial(materialId: number) {
    this.materialsService.deleteMaterial(this.courseId, materialId).subscribe({
      next: () => {
        this.loadMaterials();
      },
      error: (err) => console.error('Error deleting material', err),
    });
  }

  loadCourse(): void {
    this.coursesService.getCourseById(this.courseId).subscribe((course) => {
      if (!course) {
        console.error(`Course with id ${this.courseId} not found`);
        return;
      }
      this.canEdit = this.auth.isUserTeacherInCourse(course);
    });
  }

  getFileIcon(fileType: string): string {
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
}
