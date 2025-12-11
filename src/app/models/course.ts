export interface Course {
  id: number;
  title: string;
  description?: string;
  password?: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;

  isUserEnrolled?: boolean; 
  teachers: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: 'headteacher' | 'teacher';
  }[];
}