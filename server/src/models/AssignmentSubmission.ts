import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignmentSubmission extends Document {
  studentId: string;
  courseId: mongoose.Types.ObjectId;
  week: number;
  assignmentId: string;
  submissionLink: string;
  submittedAt: Date;
  status?: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  updatedAt?: Date;
  score?: number;
  gradedBy?: string;
  gradedAt?: Date;
  revisionRequested?: boolean;
  revisionNotes?: string;
}

const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'PredefinedCourse',
    required: true,
    index: true
  },
  week: {
    type: Number,
    required: true
  },
  assignmentId: {
    type: String,
    required: true
  },
  submissionLink: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: {
    type: String
  },
  updatedAt: {
    type: Date
  },
  score: {
    type: Number,
    min: 0
  },
  gradedBy: {
    type: String
  },
  gradedAt: {
    type: Date
  },
  revisionRequested: {
    type: Boolean,
    default: false
  },
  revisionNotes: {
    type: String
  }
});

// Create compound index for efficient querying
AssignmentSubmissionSchema.index({ studentId: 1, courseId: 1, week: 1, assignmentId: 1 }, { unique: true });

export default mongoose.model<IAssignmentSubmission>('AssignmentSubmission', AssignmentSubmissionSchema); 