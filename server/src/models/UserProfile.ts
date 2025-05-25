import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ['BCA', 'MCA', 'B.Com'],
  },
  collegeName: {
    type: String,
    required: true,
  },
  principalName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('UserProfile', UserProfileSchema); 