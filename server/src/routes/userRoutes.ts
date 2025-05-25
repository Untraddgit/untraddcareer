import express from 'express';
import {
  createOrUpdateUser,
  getUserByClerkId,
  updateUserType,
  getAllUsers,
} from '../controllers/userController';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();

// Middleware to verify Clerk session
const verifyClerkSession = async (req: any, res: any, next: any) => {
  try {
    const sessionId = req.headers.authorization?.split(' ')[1];
    if (!sessionId) {
      return res.status(401).json({ message: 'No session token provided' });
    }

    const session = await clerkClient.sessions.verifySession(sessionId, sessionId);
    req.user = session;
    next();
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(401).json({ message: 'Invalid session' });
  }
};

// Parse JSON for user routes
router.use(express.json());

// Create or update user
router.post('/', verifyClerkSession, createOrUpdateUser);

// Get user by Clerk ID
router.get('/:clerkId', verifyAuth, getUserByClerkId);

// Update user type (admin only)
router.patch('/:clerkId/type', verifyClerkSession, updateUserType);

// Get all users (admin only)
router.get('/', verifyClerkSession, getAllUsers);

export default router; 