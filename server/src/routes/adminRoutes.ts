import express from 'express';
import { verifyAuth } from '../middleware/auth';
import QuizResult from '../models/QuizResult';
import User from '../models/User';

const router = express.Router();

// Middleware to check if user is admin
const verifyAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Error verifying admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all test results (admin only)
router.get('/test-results', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const testResults = await QuizResult.find({})
      .sort({ completedAt: -1 })
      .lean();

    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all students (admin only)
router.get('/students', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const students = await User.find({})
      .select('clerkId email firstName lastName userType createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get admin dashboard stats (admin only)
router.get('/stats', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ userType: 'student' });
    const totalTests = await QuizResult.countDocuments({});
    
    const testResults = await QuizResult.find({}).select('score').lean();
    const averageScore = testResults.length > 0 
      ? testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length 
      : 0;
    
    const scholarshipEligible = testResults.filter(test => test.score >= 60).length;
    const highPerformers = testResults.filter(test => test.score >= 70).length;
    const topPerformers = testResults.filter(test => test.score >= 80).length;

    res.json({
      totalStudents,
      totalTestsTaken: totalTests,
      averageScore: Math.round(averageScore * 100) / 100,
      scholarshipEligible,
      highPerformers,
      topPerformers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 