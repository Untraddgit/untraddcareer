
// predefined Course Assigment 
export interface PredefinedCourseAssignment {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  instructions: string;
}


// Predefined-Course-Project
export interface PredefinedCourseProject {
  title: string;
  description?: string;
}


// interface Predefined-Course-Resource
export interface PredefinedCourseResource {
  title: string;
  url: string;
  type: "video" | "article" | "document" | "tool" | "other";
}

export interface PredefinedCourseWeek {
  week: number;
  title: string;
  topics: string[];
  projects: (string | PredefinedCourseProject)[];
  liveClassTopics: string[];
  resources?: PredefinedCourseResource[];
  assignments?: PredefinedCourseAssignment[];
  isCompleted?: boolean;
  completedAt?: string;
  isLocked?: boolean;
}

export interface PredefinedCourseToolsAndTechnologies {
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

export interface PredefinedCourseData {
  _id: string;
  courseName: string;
  displayName?: string;
  durationWeeks: number;
  effortPerWeek: string;
  liveClassesPerWeek: number;
  courseDescription: string;
  weeklyRoadmap: PredefinedCourseWeek[];
  toolsAndTechnologies: PredefinedCourseToolsAndTechnologies;
  expectedOutcomes: string[];
  isActive: boolean;
}

export interface PredefinedCourseModuleProgress {
  week: number;
  isCompleted: boolean;
  completedAt?: string;
  isLocked: boolean;
  completedBy?: string;
  notes?: string;
}

export interface PredefinedCourseProgress {
  _id: string;
  studentId: string;
  courseName: string;
  courseId: string;
  modules: PredefinedCourseModuleProgress[];
  overallProgress: number;
  currentWeek: number;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  totalTimeSpent: number;
}