export interface CourseCreationRequest {
  id?: number;
  courseTitle: string;
  courseDescription: string;
  coursePassword: string;
  requestedBy?: number; // User ID
  requester?: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}