import { Request, Response } from 'express';
import QuizResult from '../models/QuizResult';

// Get all quiz results
export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const results = await QuizResult.find();
    res.json(results);
  } catch (error: any) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz results',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single quiz result
export const getQuizResult = async (req: Request, res: Response) => {
  try {
    const result = await QuizResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz result',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new quiz result
export const createQuizResult = async (req: Request, res: Response) => {
  try {
    const { quizId, userId, answers, score, timeSpent, completedAt } = req.body;

    // Validate required fields
    if (!quizId || !userId || !answers || score === undefined || !timeSpent) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['quizId', 'userId', 'answers', 'score', 'timeSpent']
      });
    }

    // Validate answers format
    if (!Array.isArray(answers) || !answers.every(a => 
      typeof a.questionIndex === 'number' && 
      typeof a.selectedAnswer === 'number' && 
      typeof a.isCorrect === 'boolean'
    )) {
      return res.status(400).json({
        message: 'Invalid answers format',
        required: 'Array of {questionIndex: number, selectedAnswer: number, isCorrect: boolean}'
      });
    }

    const result = await QuizResult.create({
      quizId,
      userId,
      answers,
      score,
      timeSpent,
      completedAt: completedAt || new Date()
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating quiz result:', error);
    res.status(500).json({ 
      message: 'Error creating quiz result',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error.errors || {} // Mongoose validation errors
    });
  }
};

// Update a quiz result
export const updateQuizResult = async (req: Request, res: Response) => {
  try {
    const result = await QuizResult.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error updating quiz result:', error);
    res.status(500).json({ 
      message: 'Error updating quiz result',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a quiz result
export const deleteQuizResult = async (req: Request, res: Response) => {
  try {
    const result = await QuizResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    res.json({ message: 'Quiz result deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting quiz result:', error);
    res.status(500).json({ 
      message: 'Error deleting quiz result',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 