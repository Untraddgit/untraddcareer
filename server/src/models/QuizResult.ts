import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
  }],
  completedAt: {
    type: Date,
    default: Date.now,
  },
  timeSpent: {
    type: Number,  // in seconds
    required: true,
  }
});

export default mongoose.model('QuizResult', QuizResultSchema); 