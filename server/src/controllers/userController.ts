import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Create or update user after Clerk signup
export const createOrUpdateUser = async (req: Request, res: Response) => {
  console.log('Received create/update user request:', req.body);
  try {
    const { clerkId, email, firstName, lastName } = req.body;

    if (!clerkId || !email || !firstName || !lastName) {
      console.log('Missing required fields:', { clerkId, email, firstName, lastName });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    console.log('Checking if user exists with clerkId:', clerkId);
    let user = await User.findOne({ clerkId });

    if (user) {
      console.log('User exists, updating:', user);
      // Update existing user
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
      console.log('User updated successfully:', user);
    } else {
      console.log('User does not exist, creating new user');
      // Create new user
      user = await User.create({
        clerkId,
        email,
        firstName,
        lastName
      });
      console.log('New user created successfully:', user);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req: Request, res: Response) => {
  console.log('Received get user request for clerkId:', req.params.clerkId);
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      console.log('User not found with clerkId:', clerkId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserByClerkId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user type (admin only)
export const updateUserType = async (req: Request, res: Response) => {
  console.log('Received update user type request:', req.params, req.body);
  try {
    const { clerkId } = req.params;
    const { userType } = req.body;

    // Verify the requesting user is an admin
    const requestingUser = await User.findOne({ clerkId: req.user?.id });
    if (!requestingUser || requestingUser.userType !== 'admin') {
      console.log('Unauthorized attempt to update user type');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      console.log('User not found for type update:', clerkId);
      return res.status(404).json({ message: 'User not found' });
    }

    user.userType = userType;
    await user.save();
    console.log('User type updated successfully:', user);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUserType:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  console.log('Received get all users request');
  try {
    // Verify the requesting user is an admin
    const requestingUser = await User.findOne({ clerkId: req.user?.id });
    if (!requestingUser || requestingUser.userType !== 'admin') {
      console.log('Unauthorized attempt to get all users');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const users = await User.find().select('-__v');
    console.log(`Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 