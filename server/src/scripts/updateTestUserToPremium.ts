import mongoose from 'mongoose';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/untraddcareer';

async function updateTestUserToPremium() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a student user and update their plan to premium
    const user = await User.findOneAndUpdate(
      { userType: 'student' },
      { $set: { plan: 'premium' } },
      { new: true }
    );

    if (user) {
      console.log('Updated user to premium:', {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        plan: user.plan
      });
    } else {
      console.log('No student user found to update');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateTestUserToPremium(); 