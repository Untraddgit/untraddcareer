export interface User {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "student" | "admin";
  course?: string;
  plan?: string;
  createdAt: string;
  updatedAt: string;
}