import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import expressPlayground from 'graphql-playground-middleware-express';

// Import Routes
import userProfileRouter from './routes/userProfile';
import quizResultsRouter from './routes/quizResults';
import quizRouter from './routes/quizRoutes';
import webhookRouter from './routes/webhookRoutes';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import courseRouter from './routes/courseRoutes';
import predefinedCourseRouter from './routes/predefinedCourseRoutes';
import upcomingSessionRouter from './routes/upcomingSessionRoutes';
import studentRoutes from './routes/studentRoutes';

// Import GraphQL Setup
import { setupGraphQL } from './graphql/index';
import { Request, Response, NextFunction } from 'express';


dotenv.config();

async function startServer() {
  const app = express();

  // MongoDB connection
  const connectDB = async () => {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
      }
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  await connectDB();

  // CORS Configuration
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://untraddcareer.vercel.app',
    'https://www.untraddcareer.vercel.app',
    'https://untraddcollege.vercel.app',
    'https://www.untraddcollege.vercel.app',
    'https://untraddcollege.onrender.com',
    'https://untraddcareer.com',
    'https://www.untraddcareer.com',
    'https://untraddcollege.com',
    'https://www.untraddcollege.com',
    // Apollo Studio (remote GraphQL client)
   'https://studio.apollographql.com'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.error(`CORS blocked request from: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Webhooks (before JSON parser)
  app.use('/api/webhooks', webhookRouter);

  app.use(express.json());
  app.use(morgan('dev'));

  // Debug middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      headers: req.headers,
      body: req.body,
      query: req.query
    });
    next();
  });

  // Mount REST API routes
  app.use('/api/users', userRouter);
  app.use('/api/user-profile', userProfileRouter);
  app.use('/api/quiz-results', quizResultsRouter);
  app.use('/api/quizzes', quizRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/courses', courseRouter);
  app.use('/api/predefined-courses', predefinedCourseRouter);
  app.use('/api', upcomingSessionRouter);
  app.use('/api/student', studentRoutes);

  // Setup GraphQL after middlewares
  await setupGraphQL(app);

  // Optional GraphQL Playground
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  // Health Check
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

  // 404 handler
  app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({
      message: 'Not Found',
      path: req.path,
      method: req.method
    });
  });

  // Error handler
  app.use(( err: Error,
  req: Request,
  res: Response,
  next: NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // Start server
  const PORT = parseInt(process.env.PORT || '10000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
