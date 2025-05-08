import { Request, Response, NextFunction } from 'express';
import { Clerk } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Extend Request type to include auth property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Middleware to verify Clerk authentication
export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const claims = await clerk.verifyToken(token);
    if (!claims || !claims.sub) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token claims' });
    }
    req.user = { id: claims.sub };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};

// Custom error handler middleware
export const handleAuthError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Auth Error:', err);
  res.status(401).json({ 
    message: 'Authentication failed',
    error: err.message 
  });
}; 