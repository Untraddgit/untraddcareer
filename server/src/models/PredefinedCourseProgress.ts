import mongoose, { Document, Schema } from 'mongoose';

export interface IModuleProgress {
  week: number;
  isCompleted: boolean;
  completedAt?: Date;
  isLocked: boolean;
  completedBy?: string; // clerkId of admin who marked it complete
  notes?: string; // Admin notes
}

export interface IPredefinedCourseProgress extends Document {
  studentId: string; // clerkId of the student
  courseName: string; // matches the predefined course name
  courseId: string; // ObjectId of the predefined course
  modules: IModuleProgress[];
  overallProgress: number; // percentage (0-100)
  currentWeek: number; // Current active week
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  totalTimeSpent: number; // in minutes
}

const ModuleProgressSchema = new Schema<IModuleProgress>({
  week: {
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
  isLocked: {
    type: Boolean,
    default: true
  },
  completedBy: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
});

const PredefinedCourseProgressSchema = new Schema<IPredefinedCourseProgress>({
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
  modules: [ModuleProgressSchema],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  currentWeek: {
    type: Number,
    default: 1,
    min: 1
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
  collection: 'predefinedcourseProgress'
});

// Create compound indexes for better query performance
PredefinedCourseProgressSchema.index({ studentId: 1, courseName: 1 }, { unique: true });
PredefinedCourseProgressSchema.index({ courseId: 1 });
PredefinedCourseProgressSchema.index({ overallProgress: 1 });
PredefinedCourseProgressSchema.index({ currentWeek: 1 });

export default mongoose.model<IPredefinedCourseProgress>('PredefinedCourseProgress', PredefinedCourseProgressSchema); 