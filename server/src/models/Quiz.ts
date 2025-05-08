import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  branch: {
    type: String,
    required: true,
    enum: ['BCA', 'MCA', 'B.Com'],
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    }
  }],
  timeLimit: {
    type: Number, // in minutes
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model('Quiz', QuizSchema); 