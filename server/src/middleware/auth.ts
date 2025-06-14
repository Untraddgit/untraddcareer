import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import User from '../models/User';

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

// Middleware to verify Clerk authentication using modern JWT verification
export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      // Use the new verifyToken method (networkless verification)
      const verifiedToken = await clerkClient.verifyToken(token);
      
      if (!verifiedToken || !verifiedToken.sub) {
        return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
      }

      req.auth = { userId: verifiedToken.sub };
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

// Middleware to verify admin privileges
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin privileges required' });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ message: 'Internal server error during admin verification' });
  }
};

// Error handler for auth middleware
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Auth error:', err);
  res.status(401).json({ message: 'Authentication failed', error: err.message });
}; 