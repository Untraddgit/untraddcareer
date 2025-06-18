import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  title: string;
  description?: string;
}

export interface IResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'document' | 'tool' | 'other';
}

export interface IAssignment {
  _id?: string;
  title: string;
  description: string;
  dueDate?: Date;
  maxScore: number;
  instructions: string;
}

export interface IWeeklyModule {
  week: number;
  title: string;
  topics: string[];
  projects: IProject[] | string[];
  liveClassTopics: string[];
  resources?: IResource[];
  assignments?: IAssignment[];
  isCompleted?: boolean;
  completedAt?: Date;
  isLocked?: boolean;
}

export interface IToolsAndTechnologies {
  languages?: string[];
  frontend?: string[];
  backend?: string[];
  databases?: string[];
  authentication?: string[];
  devops?: string[];
  deployment?: string[];
  ai?: string[];
  aiTools?: string[];
  testingMonitoring?: string[];
  tooling?: string[];
  csFundamentals?: string[];
  softSkills?: string[];
  platforms?: string[];
}

export interface IPredefinedCourse extends Document {
  courseName: string; // e.g., "webdevelopmentwithai", "entrepreneurship", "uiux/digitalmarketing"
  displayName?: string; // e.g., "Full Stack Web Development Internship Track (MERN + DevOps + AI)"
  durationWeeks: number;
  effortPerWeek: string;
  liveClassesPerWeek: number;
  courseDescription: string;
  weeklyRoadmap: IWeeklyModule[];
  toolsAndTechnologies: IToolsAndTechnologies;
  expectedOutcomes: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'article', 'document', 'tool', 'other'],
    required: true
  }
});

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: false
  },
  maxScore: {
    type: Number,
    required: true,
    min: 0
  },
  instructions: {
    type: String,
    required: true
  }
});

const WeeklyModuleSchema = new Schema<IWeeklyModule>({
  week: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  topics: [{
    type: String,
    required: true
  }],
  projects: [{
    type: Schema.Types.Mixed // Can be string or Project object
  }],
  liveClassTopics: [{
    type: String,
    required: true
  }],
  resources: [ResourceSchema],
  assignments: [AssignmentSchema],
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
    default: false // All modules are now unlocked by default
  }
});

const ToolsAndTechnologiesSchema = new Schema<IToolsAndTechnologies>({
  languages: [String],
  frontend: [String],
  backend: [String],
  databases: [String],
  authentication: [String],
  devops: [String],
  deployment: [String],
  ai: [String],
  aiTools: [String],
  testingMonitoring: [String],
  tooling: [String],
  csFundamentals: [String],
  softSkills: [String],
  platforms: [String]
});

const PredefinedCourseSchema = new Schema<IPredefinedCourse>({
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
    required: false
  },
  durationWeeks: {
    type: Number,
    required: true,
    min: 1
  },
  effortPerWeek: {
    type: String,
    required: true
  },
  liveClassesPerWeek: {
    type: Number,
    required: true,
    min: 0
  },
  courseDescription: {
    type: String,
    required: true
  },
  weeklyRoadmap: [WeeklyModuleSchema],
  toolsAndTechnologies: ToolsAndTechnologiesSchema,
  expectedOutcomes: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'predefinedcourses'
});

// Create indexes for better query performance
PredefinedCourseSchema.index({ courseName: 1 });
PredefinedCourseSchema.index({ isActive: 1 });

export default mongoose.model<IPredefinedCourse>('PredefinedCourse', PredefinedCourseSchema); 