export interface UpcomingSession {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  link: string;
  isActive: boolean;
}