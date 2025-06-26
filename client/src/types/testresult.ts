export interface TestResult {
  _id: string;
  userId: string;
  studentName: string;
  score: number;
  completedAt: string;
  timeSpent: number;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>;
}