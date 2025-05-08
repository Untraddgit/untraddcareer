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

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if cannot connect to database
  }
};

connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5173',
  'https://untraddcareer.vercel.app', // Add your Vercel frontend URL
  'https://untraddcareer.com' // Add your custom domain if you have one
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to UntraddCareer API',
    status: 'running',
    version: '1.0.0'
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
const PORT = parseInt(process.env.PORT || '10000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 