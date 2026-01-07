import { CourseUser } from "./courseuser";

export interface Assessment {
  id?: number; 
  classSessionId: number;
  userId: number;
  grade: number; 
  feedback?: string;
  user?: CourseUser;
  createdAt?: string;
  updatedAt?: string;
}