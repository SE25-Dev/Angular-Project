import { Status } from './status';
import { Raport } from './raport';
import { CourseUser } from './courseuser';

export interface Section {
  id: number;
  name: string;
  statusId: number;
  createdAt?: string;
  updatedAt?: string;
  status?: Status;
  raports?: Raport[];
  users?: CourseUser[];
}
