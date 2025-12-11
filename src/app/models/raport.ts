import { FileMeta } from './filemeta';
import { Section } from './section';
import { ClassSession } from './class-session';

export interface Raport {
  id: number;
  description: string | null;
  classSessionId: number;
  sectionId: number;
  createdAt: string;
  updatedAt: string;
  files?: FileMeta[]; // Files uploaded for this raport
  section?: Section;   // Section the raport belongs to
  classSession?: ClassSession;
}