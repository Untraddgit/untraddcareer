import { Request, Response } from 'express';
import UserProfile from '../models/UserProfile';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.auth?.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Create or update user profile
export const createOrUpdateUserProfile = async (req: Request, res: Response) => {
  try {
    const { branch, collegeName, principalName, studentName } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        studentName,
        branch,
        collegeName,
        principalName,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
}; 