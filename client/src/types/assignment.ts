export interface CourseReference {
  courseName: string;
  _id: string;
  displayName?: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'graded';

export interface AssignmentSubmission {
  studentId: string;
  courseId: CourseReference;
  week: number;
  module:string,
  title:string,
  maxScore:number,
  assignmentId: string;
  submissionLink: string;
  submittedAt: string;
  status?: SubmissionStatus;
  feedback?: string;
  updatedAt?: string;
  score?: number;
  gradedBy?: string;
  gradedAt?: string;
  revisionRequested?: boolean;
  revisionNotes?: string;
}