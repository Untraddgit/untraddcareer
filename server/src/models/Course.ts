import mongoose, { Document, Schema } from 'mongoose';

export interface ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  estimatedTime: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  resources?: string[]; // URLs or resource links
}

export interface ISubtopic {
  title: string;
  description: string;
  tasks: ITask[];
  isCompleted: boolean;
  completedAt?: Date;
  estimatedTime: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  resources?: string[]; // URLs or resource links for subtopic
}

export interface ITopic {
  title: string;
  description: string;
  subtopics: ISubtopic[];
  isCompleted: boolean;
  completedAt?: Date;
  estimatedWeeks: number;
  estimatedTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
  resources?: string[]; // URLs or resource links for topic
}

export interface ICourse extends Document {
  courseName: string; // e.g., "webdevelopment", "uiux", etc.
  displayName: string; // e.g., "Web Development with AI", "UI/UX Design"
  description: string;
  topics: ITopic[];
  totalDuration: number; // in weeks
  createdBy: string; // admin clerkId
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
  estimatedTime: {
    type: Number,
    required: true,
    min: 1
  },
  estimatedTimeUnit: {
    type: String,
    required: true,
    enum: ['hours', 'days', 'weeks', 'months'],
    default: 'hours'
  },
  resources: [{
    type: String
  }]
});

const SubtopicSchema = new Schema<ISubtopic>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tasks: [TaskSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  estimatedTime: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  estimatedTimeUnit: {
    type: String,
    required: true,
    enum: ['hours', 'days', 'weeks', 'months'],
    default: 'weeks'
  },
  resources: [{
    type: String
  }]
});

const TopicSchema = new Schema<ITopic>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subtopics: [SubtopicSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  estimatedWeeks: {
    type: Number,
    required: true,
    min: 1
  },
  estimatedTimeUnit: {
    type: String,
    required: true,
    enum: ['hours', 'days', 'weeks', 'months'],
    default: 'weeks'
  },
  resources: [{
    type: String
  }]
});

const CourseSchema = new Schema<ICourse>({
  courseName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topics: [TopicSchema],
  totalDuration: {
    type: Number,
    required: true,
    min: 1
  },
  createdBy: {
    type: String,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'courses'
});

// Create indexes for better query performance
CourseSchema.index({ courseName: 1 });
CourseSchema.index({ createdBy: 1 });
CourseSchema.index({ isActive: 1 });

export default mongoose.model<ICourse>('Course', CourseSchema); 