import mongoose, { Document, Schema } from 'mongoose';

export interface IUpcomingSession extends Document {
  title: string;
  description?: string;
  date: Date;
  time: string;
  link: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UpcomingSessionSchema = new Schema<IUpcomingSession>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IUpcomingSession>('UpcomingSession', UpcomingSessionSchema); 