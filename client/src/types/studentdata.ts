export interface StudentData {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'student' | 'admin';
  plan?: string;
  createdAt: string;
}