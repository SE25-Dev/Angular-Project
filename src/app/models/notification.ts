export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  type: string; // 'raport_section_addition'
  userId: number;
  sectionId?: number;
  createdAt: string;
  updatedAt: string;
}