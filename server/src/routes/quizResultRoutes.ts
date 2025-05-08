import express from 'express';
import { verifyAuth } from '../middleware/auth';
import {
  getQuizResults,
  getQuizResult,
  createQuizResult,
  updateQuizResult,
  deleteQuizResult,
} from '../controllers/quizResultController';

const router = express.Router();

// Public routes
router.get('/', getQuizResults);
router.get('/:id', getQuizResult);

// Protected routes
router.post('/', verifyAuth, createQuizResult);
router.put('/:id', verifyAuth, updateQuizResult);
router.delete('/:id', verifyAuth, deleteQuizResult);

export default router; 