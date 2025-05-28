import express from 'express';
import {
  createOrUpdateUser,
  getUserByClerkId
} from '../controllers/userController';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();

// Parse JSON for user routes
router.use(express.json());

// Create or update user
router.post('/', verifyAuth, createOrUpdateUser);

// Get user by Clerk ID
router.get('/:clerkId', verifyAuth, getUserByClerkId);

export default router; 