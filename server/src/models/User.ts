import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    default: 'User'
  },
  lastName: {
    type: String,
    required: false,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'users' // Explicitly set collection name
});

// Create indexes for better query performance
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });

// Add a compound index for name searches
UserSchema.index({ firstName: 1, lastName: 1 });

export default mongoose.model<IUser>('User', UserSchema); 