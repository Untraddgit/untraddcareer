import express from 'express';
import UserProfile from '../models/UserProfile';
import { verifyAuth, handleAuthError } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);
router.use(handleAuthError);

// Get user profile by userId query param or from auth token
router.get('/', async (req, res) => {
  try {
    // Get userId from query param or from auth token
    const userId = req.query.userId as string || req.auth?.userId;
    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ message: 'Missing userId' });
    }

    console.log('Fetching profile for user:', userId);
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      console.log('Profile not found for user:', userId);
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log('Profile found:', profile);
    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Create/Update user profile
router.post('/', async (req, res) => {
  try {
    console.log('Received profile data:', req.body);
    // Get userId from body or from auth token
    const userId = req.body.userId || req.auth?.userId;
    const { branch, collegeName, principalName, studentName } = req.body;
    
    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ message: 'Missing userId' });
    }
    
    if (!branch || !collegeName || !principalName || !studentName) {
      console.log('Missing required fields:', { branch, collegeName, principalName, studentName });
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['branch', 'collegeName', 'principalName', 'studentName']
      });
    }

    console.log('Creating/updating profile for user:', userId);
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
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log('Profile saved successfully:', profile);
    res.status(201).json(profile);
  } catch (error: any) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile', error: error.message });
  }
});

export default router; 