import { Request, Response } from 'express';
import Quiz from '../models/Quiz';

// Get all quizzes
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
};

// Get single quiz
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};

// Create quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz' });
  }
};

// Update quiz
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz' });
  }
};

// Delete quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz' });
  }
}; 