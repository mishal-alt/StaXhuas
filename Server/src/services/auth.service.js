import mongoose from 'mongoose';
import User from '../models/User.js';
import Invitation from '../models/Invitation.js';
import { ApiError } from '../utils/apiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { INVITATION_STATUS } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const acceptInvite = async (token, password) => {
  const invitation = await Invitation.findOne({ token, status: INVITATION_STATUS.PENDING });
  
  if (!invitation) {
    throw new ApiError(400, 'Invalid or expired invitation token');
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = INVITATION_STATUS.EXPIRED;
    await invitation.save();
    throw new ApiError(400, 'Invitation has expired');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create User
    const user = new User({
      name: invitation.name,
      email: invitation.email,
      password,
      role: invitation.role,
      batch: invitation.batch,
    });

    await user.save({ session });

    // Update Invitation
    invitation.status = INVITATION_STATUS.ACCEPTED;
    invitation.acceptedAt = new Date();
    await invitation.save({ session });

    // Log Action
    await logAction(
      {
        action: 'INVITATION_ACCEPTED',
        performedBy: user._id, // User performs this action on themselves
        entityType: 'User',
        entityId: user._id,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if active (only students have status right now technically, but we can check if discontinued)
  if (user.status && user.status === 'discontinued') {
     throw new ApiError(403, 'Account is discontinued. Please contact admin.');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
