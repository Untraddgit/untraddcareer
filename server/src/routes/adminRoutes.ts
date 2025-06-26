import express from 'express';
import { verifyAuth } from '../middleware/auth';
import QuizResult from '../models/QuizResult';
import User from '../models/User';
import CounsellingSession from '../models/CounsellingSession';
import StudentFeedback from '../models/StudentFeedback';
import AssignmentSubmission from '../models/AssignmentSubmission';

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
      .select('clerkId email firstName lastName userType plan createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all premium students (admin only)
router.get('/premium-students', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const premiumStudents = await User.find({ 
      userType: 'student',
      plan: 'premium'
    })
      .select('clerkId email firstName lastName plan createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(premiumStudents);
  } catch (error) {
    console.error('Error fetching premium students:', error);
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

// Get all counselling sessions (admin only)
router.get('/counselling-sessions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const sessions = await CounsellingSession.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching counselling sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new counselling session (admin only)
router.post('/counselling-sessions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { studentId, scheduledDate, scheduledTime, notes } = req.body;

    const session = new CounsellingSession({
      studentId,
      scheduledDate,
      scheduledTime,
      notes
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating counselling session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a counselling session (admin only)
router.put('/counselling-sessions/:sessionId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, feedback } = req.body;

    const session = await CounsellingSession.findByIdAndUpdate(
      sessionId,
      { status, feedback },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error updating counselling session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all student feedback (admin only)
router.get('/student-feedback', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const feedback = await StudentFeedback.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student feedback by ID (admin only)
router.get('/student-feedback/:studentId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const feedback = await StudentFeedback.findOne({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })
      .lean();

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or update student feedback (admin only)
router.post('/student-feedback', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const feedbackData = req.body;
    
    // Update if exists, create if doesn't
    const feedback = await StudentFeedback.findOneAndUpdate(
      { studentId: feedbackData.studentId },
      feedbackData,
      { new: true, upsert: true }
    );

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error saving student feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/grade-assignment',verifyAuth,verifyAdmin,async (req, res) => {
  try {
    const { studentId, courseId, assignmentId, week, score, feedback, gradedBy } = req.body;

    const updated = await AssignmentSubmission.findOneAndUpdate(
      { studentId, courseId, assignmentId, week },
      {
        score,
        feedback,
        status: 'graded',
        gradedAt: new Date(),
        gradedBy
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    res.json({ message: 'Assignment graded successfully', submission: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error grading assignment' });
  }
});

 //all-students-performance
router.get('/all-students-performance',verifyAuth,verifyAdmin, async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find()
      .populate('courseId') // From PredefinedCourse
      .lean();

    const grouped = submissions.reduce((acc, submission) => {
      const key = submission.studentId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(submission);
      return acc;
    }, {} as Record<string, any[]>);

    // console.log("grouped:-",grouped)
    res.json(grouped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch performance' });
  }
});

//student/my-performance/:studentId
router.get('/student/my-performance/:studentId',verifyAuth,verifyAdmin,async (req, res) => {
  try {
    const { studentId } = req.params;
    const submissions = await AssignmentSubmission.find({ studentId })
      .populate('courseId')
      .sort({ week: 1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching performance' });
  }
});





export default router; 