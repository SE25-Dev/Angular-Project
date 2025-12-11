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