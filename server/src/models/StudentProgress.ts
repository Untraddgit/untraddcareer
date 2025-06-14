import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentTaskProgress {
  taskIndex: number;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent?: number; // in minutes
  notes?: string;
}

export interface IStudentSubtopicProgress {
  subtopicIndex: number;
  isCompleted: boolean;
  completedAt?: Date;
  tasks: IStudentTaskProgress[];
}

export interface IStudentTopicProgress {
  topicIndex: number;
  isCompleted: boolean;
  completedAt?: Date;
  subtopics: IStudentSubtopicProgress[];
}

export interface IStudentProgress extends Document {
  studentId: string; // clerkId of the student
  courseName: string; // matches the course they're enrolled in
  courseId: string; // ObjectId of the course
  topics: IStudentTopicProgress[];
  overallProgress: number; // percentage (0-100)
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  totalTimeSpent: number; // in minutes
}

const StudentTaskProgressSchema = new Schema<IStudentTaskProgress>({
  taskIndex: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    required: false
  }
});

const StudentSubtopicProgressSchema = new Schema<IStudentSubtopicProgress>({
  subtopicIndex: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  tasks: [StudentTaskProgressSchema]
});

const StudentTopicProgressSchema = new Schema<IStudentTopicProgress>({
  topicIndex: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  subtopics: [StudentSubtopicProgressSchema]
});

const StudentProgressSchema = new Schema<IStudentProgress>({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  courseName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  courseId: {
    type: String,
    required: true,
    index: true
  },
  topics: [StudentTopicProgressSchema],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    required: false
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'studentProgress'
});

// Create compound indexes for better query performance
StudentProgressSchema.index({ studentId: 1, courseName: 1 }, { unique: true });
StudentProgressSchema.index({ courseId: 1 });
StudentProgressSchema.index({ overallProgress: 1 });

export default mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema); 