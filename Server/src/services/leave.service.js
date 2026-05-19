import mongoose from 'mongoose';
import LeaveRequest from '../models/LeaveRequest.js';
import Batch from '../models/Batch.js';
import BatchConfig from '../models/BatchConfig.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES, LEAVE_STATUS, ATTENDANCE_STATUS } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const createLeaveRequest = async (studentUser, data) => {
  const { startDate, endDate, reason } = data;

  const student = await User.findById(studentUser._id).populate('batch');
  if (!student || !student.batch) {
    throw new ApiError(400, 'You are not assigned to an active batch');
  }

  const batch = await Batch.findById(student.batch).populate('config');
  if (!batch || !batch.config) {
    throw new ApiError(400, 'Batch configuration missing');
  }

  const config = batch.config;

  // Calculate requested days (simplified: just difference in days)
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setUTCHours(0, 0, 0, 0);

  const requestedDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Check how many approved leaves student has
  const approvedLeaves = await LeaveRequest.find({
    student: student._id,
    batch: batch._id,
    status: LEAVE_STATUS.APPROVED
  });

  let totalUsedDays = 0;
  approvedLeaves.forEach(leave => {
    const lStart = new Date(leave.startDate);
    const lEnd = new Date(leave.endDate);
    totalUsedDays += Math.round((lEnd - lStart) / (1000 * 60 * 60 * 24)) + 1;
  });

  if (totalUsedDays + requestedDays > config.leaveLimit) {
    throw new ApiError(400, `Leave limit exceeded. You have ${config.leaveLimit - totalUsedDays} days left.`);
  }

  const leaveRequest = new LeaveRequest({
    student: student._id,
    batch: batch._id,
    startDate: start,
    endDate: end,
    reason,
  });

  await leaveRequest.save();

  await logAction({
    action: 'LEAVE_REQUESTED',
    performedBy: student._id,
    entityType: 'LeaveRequest',
    entityId: leaveRequest._id,
    details: { startDate: start, endDate: end, requestedDays },
  });

  return leaveRequest;
};

export const reviewLeaveRequest = async (facilitator, leaveId, data) => {
  const { status, remark } = data;

  const leaveRequest = await LeaveRequest.findById(leaveId).populate('batch');
  if (!leaveRequest) throw new ApiError(404, 'Leave request not found');

  if (leaveRequest.status !== LEAVE_STATUS.PENDING) {
    throw new ApiError(400, `Leave request is already ${leaveRequest.status}`);
  }

  const batch = leaveRequest.batch;
  if (facilitator.role === ROLES.FACILITATOR && batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to review this leave request');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    leaveRequest.status = status;
    leaveRequest.reviewedBy = facilitator._id;
    leaveRequest.remark = remark || '';

    await leaveRequest.save({ session });

    // If approved, sync to attendance
    if (status === LEAVE_STATUS.APPROVED) {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      const operations = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        // Note: In a real app we'd skip weekends based on batch.config.workingDays
        operations.push({
          updateOne: {
            filter: { student: leaveRequest.student, date: currentDate },
            update: {
              $set: {
                student: leaveRequest.student,
                batch: batch._id,
                date: currentDate,
                status: ATTENDANCE_STATUS.LEAVE,
                markedBy: facilitator._id,
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await Attendance.bulkWrite(operations, { session });
      }
    }

    await logAction(
      {
        action: 'LEAVE_REVIEWED',
        performedBy: facilitator._id,
        entityType: 'LeaveRequest',
        entityId: leaveRequest._id,
        details: { status, remark },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return leaveRequest;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getLeaveRequests = async (user, batchId = null) => {
  const query = {};

  if (user.role === ROLES.STUDENT) {
    query.student = user._id;
  } else if (user.role === ROLES.FACILITATOR) {
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch || batch.facilitator.toString() !== user._id.toString()) {
        throw new ApiError(403, 'Not authorized');
      }
      query.batch = batchId;
    } else {
      // Fetch all batches for this facilitator
      const facilitatorBatches = await Batch.find({ facilitator: user._id });
      const batchIds = facilitatorBatches.map(b => b._id);
      query.batch = { $in: batchIds };
    }
  } else if (batchId) {
    query.batch = batchId;
  }

  return await LeaveRequest.find(query)
    .populate('student', 'name email')
    .populate('reviewedBy', 'name')
    .sort('-createdAt');
};
