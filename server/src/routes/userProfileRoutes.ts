import express from 'express';
import { verifyAuth, handleAuthError } from '../middleware/auth';
import {
  getUserProfile,
  createOrUpdateUserProfile,
} from '../controllers/userProfileController';

const router = express.Router();

// All routes are protected
router.use(verifyAuth);
router.use(handleAuthError);

router.get('/', getUserProfile);
router.post('/', createOrUpdateUserProfile);

export default router; 