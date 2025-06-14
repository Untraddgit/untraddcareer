import express from 'express';
import { verifyAuth, verifyAdmin } from '../middleware/auth';
import UpcomingSession from '../models/UpcomingSession';

const router = express.Router();

// Get all active upcoming sessions (for students)
router.get('/student/upcoming-sessions', verifyAuth, async (req, res) => {
  try {
    const sessions = await UpcomingSession.find({ isActive: true })
      .sort({ date: 1, time: 1 })
      .limit(5);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all upcoming sessions (admin only)
router.get('/admin/upcoming-sessions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const sessions = await UpcomingSession.find()
      .sort({ date: 1, time: 1 });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new upcoming session (admin only)
router.post('/admin/upcoming-sessions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, time, link } = req.body;
    
    const session = new UpcomingSession({
      title,
      description,
      date,
      time,
      link
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating upcoming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update upcoming session (admin only)
router.put('/admin/upcoming-sessions/:id', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, link, isActive } = req.body;

    const session = await UpcomingSession.findByIdAndUpdate(
      id,
      { title, description, date, time, link, isActive },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error updating upcoming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete upcoming session (admin only)
router.delete('/admin/upcoming-sessions/:id', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const session = await UpcomingSession.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting upcoming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 