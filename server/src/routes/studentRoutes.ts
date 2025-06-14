import express, { Request, Response } from 'express';
import { verifyAuth } from '../middleware/auth';
import StudentFeedback from '../models/StudentFeedback';

const router = express.Router();

// Get student feedback
router.get('/feedback', verifyAuth, async (req: Request, res: Response) => {
  try {
    const studentId = req.auth?.userId;
    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }
    
    const feedback = await StudentFeedback.findOne({ studentId });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: 'Error fetching student feedback' });
  }
});

export default router; 