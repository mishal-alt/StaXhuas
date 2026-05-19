import mongoose from 'mongoose';
import LeaveRequest from '../models/LeaveRequest.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES, LEAVE_STATUS, ATTENDANCE_STATUS } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const createLeaveRequest = async (studentId, data) => {
  const { batchId, leaveType, reason, fromDate, toDate, supportingDocument } = data;

  const start = new Date(fromDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setUTCHours(0, 0, 0, 0);

  if (start > end) {
    throw new ApiError(400, 'fromDate cannot be after toDate');
  }

  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  // Check for overlap
  const existingLeave = await LeaveRequest.findOne({
    student: studentId,
    status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] },
    $or: [
      { fromDate: { $lte: end }, toDate: { $gte: start } }
    ]
  });

  if (existingLeave) {
    throw new ApiError(400, 'You already have a pending or approved leave request during these dates.');
  }

  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Enforce batch leave limits here if needed (e.g. from batch.config)

  const leaveRequest = new LeaveRequest({
    student: studentId,
    batch: batchId,
    leaveType,
    reason,
    fromDate: start,
    toDate: end,
    totalDays,
    supportingDocument
  });

  await leaveRequest.save();
  return leaveRequest;
};

export const getLeaveRequests = async (user, filters = {}) => {
  const query = {};

  if (user.role === ROLES.STUDENT) {
    query.student = user._id;
  } else if (user.role === ROLES.FACILITATOR) {
    if (filters.batch) {
      query.batch = filters.batch;
    } else {
      const batches = await Batch.find({ facilitator: user._id });
      query.batch = { $in: batches.map(b => b._id) };
    }
  } else if (filters.batch) {
    query.batch = filters.batch;
  }

  if (filters.status && filters.status !== 'All') query.status = filters.status;
  if (filters.leaveType && filters.leaveType !== 'All') query.leaveType = filters.leaveType;
  if (filters.startDate && filters.endDate) {
     query.fromDate = { $gte: new Date(filters.startDate) };
     query.toDate = { $lte: new Date(filters.endDate) };
  }

  return await LeaveRequest.find(query)
    .populate('student', 'name email')
    .populate('batch', 'name')
    .sort('-appliedAt');
};

export const reviewLeaveRequest = async (facilitator, leaveId, status, remarks = '') => {
  const leaveRequest = await LeaveRequest.findById(leaveId).populate('batch');
  if (!leaveRequest) throw new ApiError(404, 'Leave request not found');

  if (leaveRequest.status !== LEAVE_STATUS.PENDING) {
    throw new ApiError(400, `Leave request is already ${leaveRequest.status}`);
  }

  if (facilitator.role === ROLES.FACILITATOR && leaveRequest.batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to review this leave request');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    leaveRequest.status = status;
    leaveRequest.remarks = remarks;

    if (status === LEAVE_STATUS.APPROVED) {
      leaveRequest.approvedBy = facilitator._id;
      leaveRequest.approvedAt = new Date();
      leaveRequest.attendanceSynced = true;

      // Sync to attendance
      const start = new Date(leaveRequest.fromDate);
      const end = new Date(leaveRequest.toDate);
      const operations = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        operations.push({
          updateOne: {
            filter: { student: leaveRequest.student, batch: leaveRequest.batch._id, date: currentDate },
            update: {
              $set: {
                student: leaveRequest.student,
                batch: leaveRequest.batch._id,
                date: currentDate,
                status: ATTENDANCE_STATUS.LEAVE,
                facilitator: facilitator._id,
                attendanceSource: 'leave_sync',
                remarks: `Leave approved: ${leaveRequest.leaveType}`
              },
            },
            upsert: true,
          },
        });
      }

      if (operations.length > 0) {
        await Attendance.bulkWrite(operations, { session });
      }

    } else if (status === LEAVE_STATUS.REJECTED) {
      leaveRequest.rejectedBy = facilitator._id;
      leaveRequest.rejectedAt = new Date();
    } else if (status === LEAVE_STATUS.CANCELLED) {
      // Cancel logic
    }

    await leaveRequest.save({ session });

    await logAction(
      {
        action: 'LEAVE_REVIEWED',
        performedBy: facilitator._id,
        entityType: 'LeaveRequest',
        entityId: leaveRequest._id,
        details: { status, remarks },
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

export const getStudentLeaveHistory = async (studentId) => {
  return await LeaveRequest.find({ student: studentId })
    .populate('batch', 'name')
    .sort('-appliedAt');
};

export const getLeaveAnalytics = async (batchId) => {
  const stats = await LeaveRequest.aggregate([
    { $match: { batch: new mongoose.Types.ObjectId(batchId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDays: { $sum: '$totalDays' }
      }
    }
  ]);
  
  const typeStats = await LeaveRequest.aggregate([
    { $match: { batch: new mongoose.Types.ObjectId(batchId), status: LEAVE_STATUS.APPROVED } },
    {
      $group: {
        _id: '$leaveType',
        count: { $sum: 1 }
      }
    }
  ]);

  return { stats, typeStats };
};
