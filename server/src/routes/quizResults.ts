import express, { Request } from 'express';
import QuizResult from '../models/QuizResult';
import { verifyAuth } from '../middleware/auth';

interface AuthRequest extends express.Request {
  user?: { id: string };
}

const router = express.Router();

// Use auth middleware for all routes
router.use(verifyAuth);

// Get quiz results by authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.query.userId as string || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const results = await QuizResult.find({ userId }).sort({ completedAt: -1 });
    res.json(results);
  } catch (error: any) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Error fetching quiz results', error: error.message });
  }
});

// Submit quiz result
router.post('/', async (req: AuthRequest, res) => {
  try {
    // Get userId from body or from auth token
    const userId = req.body.userId || req.user?.id;
    console.log('Submitting quiz result:', {
      userId,
      quizId: req.body.quizId,
      score: req.body.score,
      timeSpent: req.body.timeSpent,
      answersCount: req.body.answers?.length
    });
    
    const { quizId, score, answers, timeSpent, completedAt, studentName } = req.body;
    
    if (!userId) {
      console.error('Missing userId in request');
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }
    if (!quizId || score === undefined || !answers || timeSpent === undefined || !studentName) {
      console.error('Missing required fields:', { quizId, score, answers, timeSpent, studentName });
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['quizId', 'score', 'answers', 'timeSpent', 'studentName']
      });
    }

    // Check if user has already taken the test
    const existingResult = await QuizResult.findOne({ userId });
    if (existingResult) {
      console.log('User has already taken the test:', existingResult);
      return res.status(400).json({ 
        message: 'You have already taken the test',
        result: existingResult
      });
    }

    // Create new result
    const result = new QuizResult({
      userId,
      studentName,
      quizId,
      score,
      answers,
      timeSpent,
      completedAt: completedAt || new Date()
    });

    const savedResult = await result.save();
    console.log('Successfully saved quiz result:', savedResult);
    
    res.status(201).json(savedResult);
  } catch (error: any) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ message: 'Failed to save quiz result', error: error.message });
  }
});

// Check test status
router.get('/check-test-status', async (req: AuthRequest, res) => {
  try {
    const userId = req.query.userId as string || req.user?.id;
    console.log('Checking test status for userId:', userId);

    if (!userId) {
      console.error('Missing userId in request');
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const existingResult = await QuizResult.findOne({ userId });
    console.log('Found test result:', existingResult);

    res.json({ 
      hasAttempted: !!existingResult,
      result: existingResult
    });
  } catch (error: any) {
    console.error('Error checking test status:', error);
    res.status(500).json({ message: 'Error checking test status', error: error.message });
  }
});

// Delete previous test result for user (reset)
router.delete('/reset', async (req: AuthRequest, res) => {
  try {
    const userId = req.query.userId as string || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const result = await QuizResult.deleteMany({ userId });
    console.log(`Deleted ${result.deletedCount} quiz results for user ${userId}`);
    
    res.json({ 
      message: 'Quiz results reset successfully',
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Error resetting quiz results:', error);
    res.status(500).json({ message: 'Error resetting quiz results', error: error.message });
  }
});

export default router; 