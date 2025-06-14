import mongoose from 'mongoose';

const counsellingSessionSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CounsellingSession = mongoose.model('CounsellingSession', counsellingSessionSchema);

export default CounsellingSession; 