import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Extend Request type to include auth property
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

// Middleware to verify Clerk authentication
export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const session = await clerkClient.sessions.verifySession(token, token);
      if (!session || !session.userId) {
        console.log('Invalid session or missing userId');
        return res.status(401).json({ message: 'Unauthorized: Invalid session' });
      }

      req.auth = { userId: session.userId };
      console.log('Auth verified for user:', session.userId);
      next();
    } catch (error) {
      console.error('Error verifying session:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

// Error handler for auth middleware
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Auth error:', err);
  res.status(401).json({ message: 'Authentication failed', error: err.message });
}; 