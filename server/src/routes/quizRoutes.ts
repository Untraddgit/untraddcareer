import express from 'express';
import { verifyAuth } from '../middleware/auth';
import Quiz from '../models/Quiz';

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true });
    res.json(quizzes);
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ 
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
});

// Get quiz by branch
router.get('/branch/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    if (!branch) {
      return res.status(400).json({ message: 'Branch parameter is required' });
    }
    
    const quiz = await Quiz.findOne({ branch, isActive: true });
    if (!quiz) {
      return res.status(404).json({ message: `No quiz found for branch: ${branch}` });
    }
    
    res.json(quiz);
  } catch (error: any) {
    console.error(`Error fetching quiz for branch ${req.params.branch}:`, error);
    res.status(500).json({ 
      message: 'Error fetching quiz',
      error: error.message
    });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error: any) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz',
      error: error.message
    });
  }
});

// Protected routes below
router.use(verifyAuth);

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ 
      message: 'Error creating quiz',
      error: error.message
    });
  }
});

// Update a quiz
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error: any) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ 
      message: 'Error updating quiz',
      error: error.message
    });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ 
      message: 'Error deleting quiz',
      error: error.message
    });
  }
});

export default router; 