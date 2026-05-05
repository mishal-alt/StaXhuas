import mongoose from 'mongoose';
import Interview from '../models/Interview.js';
import InterviewScore from '../models/InterviewScore.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const scheduleInterview = async (facilitator, data) => {
  const { student: studentId, module: moduleId, interviewer: interviewerId, scheduledDate } = data;

  const student = await User.findById(studentId);
  if (!student || !student.batch) throw new ApiError(404, 'Student not found or not in a batch');

  const batch = await Batch.findById(student.batch).populate('config');
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (facilitator.role === ROLES.FACILITATOR && batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to schedule interviews for this batch');
  }

  const interviewer = await User.findOne({ _id: interviewerId, role: ROLES.INTERVIEWER });
  if (!interviewer) throw new ApiError(400, 'Invalid interviewer assigned');

  // Check existing attempts for this module
  const pastAttempts = await Interview.find({ student: studentId, module: moduleId }).sort('attemptNumber');
  
  let attemptNumber = 1;
  let isReinterview = false;

  if (pastAttempts.length > 0) {
    const lastAttempt = pastAttempts[pastAttempts.length - 1];
    
    if (lastAttempt.status !== 'scored') {
      throw new ApiError(400, 'Cannot schedule a new interview. The previous interview is not yet scored.');
    }

    const lastScore = await InterviewScore.findOne({ interview: lastAttempt._id });
    if (lastScore && lastScore.isPass) {
      throw new ApiError(400, 'Student has already passed this module interview.');
    }

    attemptNumber = pastAttempts.length + 1;
    isReinterview = true;

    // Check against BatchConfig limits
    // Max attempts = 1 initial + reinterviewLimit
    const maxAttempts = 1 + batch.config.reinterviewLimit;
    if (attemptNumber > maxAttempts) {
      // Escalated state
      throw new ApiError(403, `Re-interview limit exhausted. Limit is ${batch.config.reinterviewLimit}. Escalation required.`, 'LIMIT_EXCEEDED');
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const interview = new Interview({
      student: studentId,
      batch: batch._id,
      module: moduleId,
      interviewer: interviewerId,
      scheduledDate,
      scheduledBy: facilitator._id,
      isReinterview,
      attemptNumber,
    });

    await interview.save({ session });

    await logAction(
      {
        action: 'INTERVIEW_SCHEDULED',
        performedBy: facilitator._id,
        entityType: 'Interview',
        entityId: interview._id,
        details: { studentId, moduleId, attemptNumber },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return interview;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const scoreInterview = async (facilitator, interviewId, data) => {
  const { score, isPass, interviewerFeedback } = data;

  const interview = await Interview.findById(interviewId).populate('batch');
  if (!interview) throw new ApiError(404, 'Interview not found');

  if (interview.status === 'scored') {
    throw new ApiError(400, 'This interview has already been scored');
  }

  const batch = interview.batch;
  if (facilitator.role === ROLES.FACILITATOR && batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Only the assigned facilitator can record the score');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const interviewScore = new InterviewScore({
      interview: interviewId,
      student: interview.student,
      score,
      isPass,
      interviewerFeedback,
      scoredBy: facilitator._id,
    });

    await interviewScore.save({ session });

    interview.status = 'scored';
    await interview.save({ session });

    await logAction(
      {
        action: 'INTERVIEW_SCORED',
        performedBy: facilitator._id,
        entityType: 'Interview',
        entityId: interview._id,
        details: { score, isPass },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return interviewScore;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getInterviews = async (user, batchId = null) => {
  const query = {};

  if (user.role === ROLES.INTERVIEWER) {
    query.interviewer = user._id;
  } else if (user.role === ROLES.STUDENT) {
    query.student = user._id;
  } else if (user.role === ROLES.FACILITATOR) {
    if (batchId) {
       query.batch = batchId;
    } else {
       // Ideally we fetch batches they own and use $in, simplified here
       // If no batch provided, just return empty or require batchId
    }
  }

  return await Interview.find(query)
    .populate('student', 'name email')
    .populate('module', 'name')
    .populate('interviewer', 'name')
    .sort('scheduledDate');
};
