import { FileMeta } from './filemeta';

export interface Material {
  id: number;
  title: string;
  index: number;
  description: string;
  visible: boolean;
  courseId: number;
  files: FileMeta[];
}

export interface MaterialData {
  title: string;
  description: string;
  visible: boolean;
}

export interface MaterialUpdateData extends Partial<MaterialData> {
  deletedFileIds?: number[];
  newFileIds?: number[];
}