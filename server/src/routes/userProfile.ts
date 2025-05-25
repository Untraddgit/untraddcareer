import express from 'express';
import UserProfile from '../models/UserProfile';
import { verifyAuth } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: { id: string };
}

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);

// Get user profile by userId query param or from auth token
router.get('/', async (req: AuthRequest, res) => {
  try {
    // Get userId from query param or from auth token
    const userId = req.query.userId as string || req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    console.log('Fetching profile for user:', userId);
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Create/Update user profile
router.post('/', async (req: AuthRequest, res) => {
  try {
    console.log('Received profile data:', req.body);
    // Get userId from body or from auth token
    const userId = req.body.userId || req.user?.id;
    const { branch, collegeName, principalName, studentName } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    
    if (!branch || !collegeName || !principalName || !studentName) {
      return res.status(400).json({ message: 'Missing required fields: branch, collegeName, principalName, studentName' });
    }

    let profile = await UserProfile.findOne({ userId });
    if (profile) {
      profile.studentName = studentName;
      profile.branch = branch;
      profile.collegeName = collegeName;
      profile.principalName = principalName;
    } else {
      profile = new UserProfile({ userId, studentName, branch, collegeName, principalName });
    }

    const savedProfile = await profile.save();
    console.log('Saved profile:', savedProfile);
    res.status(201).json(savedProfile);
  } catch (error: any) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile', error: error.message });
  }
});

export default router; 