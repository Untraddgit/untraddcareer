import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userProfileRouter from './routes/userProfile';
import quizResultsRouter from './routes/quizResults';
import quizRouter from './routes/quizRoutes';

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5173'], // Vite ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Mount routers
app.use('/api/user-profile', userProfileRouter);
app.use('/api/quiz-results', quizResultsRouter);
app.use('/api/quizzes', quizRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ 
    message: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 