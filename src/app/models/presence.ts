import { CourseUser } from "./courseuser";

export interface Presence {
  id?: number;
  classSessionId: number;
  userId: number;
  present: boolean; // CHANGED from isPresent to match Backend/DB
  user?: CourseUser;
  createdAt?: string;
  updatedAt?: string;
}