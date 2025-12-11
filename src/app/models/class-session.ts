import { Raport } from "./raport";

export interface ClassSession {
  id: number;
  topic: string;
  startingDateTime: Date;
  endingDateTime: Date;
  visible: boolean;
  courseId: number;
  raport: Raport;
}