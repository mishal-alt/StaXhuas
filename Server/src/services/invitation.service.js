import Invitation from '../models/Invitation.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { sendEmail } from '../config/mailer.js';
import { inviteEmailTemplate } from '../utils/emailTemplates/invite.email.js';
import { env } from '../config/env.js';
import { INVITATION_STATUS, ROLES } from '../utils/constants.js';
import { logAction } from './audit.service.js';
import mongoose from 'mongoose';

export const createInvitation = async (inviter, inviteData) => {
  const { name, email, role, batch } = inviteData;

  // Business Rule 1: Facilitators can only invite students to their own batches
  if (inviter.role === ROLES.FACILITATOR) {
    if (role !== ROLES.STUDENT) {
      throw new ApiError(403, 'Facilitators can only invite students.');
    }
    // Note: We would check if the batch belongs to the facilitator here, 
    // but assuming batch ID is provided and valid for now.
    if (!batch) {
       throw new ApiError(400, 'Batch is required when inviting a student.');
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  // Generate Token and Expiry
  const token = Invitation.generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.jwt.inviteExpiresDays);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = new Invitation({
      email,
      name,
      role,
      invitedBy: inviter._id,
      batch: batch || null,
      token,
      expiresAt,
    });

    await invitation.save({ session });

    // Audit Log
    await logAction(
      {
        action: 'INVITATION_CREATED',
        performedBy: inviter._id,
        entityType: 'Invitation',
        entityId: invitation._id,
        details: { email, role, batch },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    // Send email (outside transaction so we don't hold the lock if email fails slowly)
    try {
      await sendEmail({
        to: email,
        subject: 'You are invited to Staxhaus',
        html: inviteEmailTemplate(name, token, role), // Ignoring batch name resolution for simplicity
      });
    } catch (emailError) {
      console.error('Failed to send invite email:', emailError);
      // We don't rollback the invite, just log the error. Can be resent.
    }

    return invitation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Catch duplicate pending invite error
    if (error.code === 11000) {
       throw new ApiError(400, 'A pending invitation for this email already exists.');
    }
    throw error;
  }
};

export const getInvitations = async (user) => {
  // Admins see all, Facilitators see only ones they issued
  const filter = user.role === ROLES.ADMIN ? {} : { invitedBy: user._id };
  return await Invitation.find(filter)
    .populate('invitedBy', 'name email')
    .sort('-createdAt');
};

export const revokeInvitation = async (inviter, inviteId) => {
  const invitation = await Invitation.findById(inviteId);
  if (!invitation) throw new ApiError(404, 'Invitation not found');

  if (inviter.role !== ROLES.ADMIN && invitation.invitedBy.toString() !== inviter._id.toString()) {
     throw new ApiError(403, 'Not authorized to revoke this invitation');
  }

  if (invitation.status !== INVITATION_STATUS.PENDING) {
    throw new ApiError(400, `Cannot revoke a ${invitation.status} invitation`);
  }

  invitation.status = INVITATION_STATUS.REVOKED;
  await invitation.save();

  await logAction({
    action: 'INVITATION_REVOKED',
    performedBy: inviter._id,
    entityType: 'Invitation',
    entityId: invitation._id,
  });

  return invitation;
};
