import mongoose from 'mongoose';

const studentFeedbackSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  semester: {
    type: String,
  },
  college: {
    type: String,
  },
  threeWords: {
    type: [String],
  },
  strengths: {
    type: String,
  },
  areasOfImprovement: {
    type: String,
  },
  stressHandling: {
    type: String,
  },
  motivation: {
    type: String,
  },
  englishRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  hindiRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  confidence: {
    type: String,
  },
  decisionMaking: {
    type: String,
  },
  biggestAchievement: {
    type: String,
  },
  turningPoint: {
    type: String,
  },
  conflicts: {
    type: String,
  },
  futureConcern: {
    type: String,
  },
  alignInThoughts: {
    type: String,
  },
  courseChosen: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentFeedback = mongoose.model('StudentFeedback', studentFeedbackSchema);

export default StudentFeedback; 