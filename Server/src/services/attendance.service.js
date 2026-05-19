import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import Batch from '../models/Batch.js';
import LeaveRequest from '../models/LeaveRequest.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES, ATTENDANCE_STATUS, LEAVE_STATUS } from '../utils/constants.js';
import { logAction } from './audit.service.js';

const checkBatchAccess = async (user, batchId) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');
  if (user.role === ROLES.FACILITATOR && batch.facilitator.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this batch');
  }
  return batch;
};

export const getAttendanceForDate = async (user, batchId, date) => {
  await checkBatchAccess(user, batchId);
  const queryDate = new Date(date);
  queryDate.setUTCHours(0, 0, 0, 0);

  return await Attendance.find({ batch: batchId, date: queryDate })
    .populate('student', 'name email status')
    .sort('createdAt');
};

export const markSingleAttendance = async (facilitator, data) => {
  const { batchId, studentId, date, status, remarks } = data;
  await checkBatchAccess(facilitator, batchId);

  const attendanceDate = new Date(date);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  // Check if student is on approved leave
  const activeLeave = await LeaveRequest.findOne({
    student: studentId,
    status: LEAVE_STATUS.APPROVED,
    fromDate: { $lte: attendanceDate },
    toDate: { $gte: attendanceDate }
  });

  const finalStatus = activeLeave ? ATTENDANCE_STATUS.LEAVE : status;
  const finalSource = activeLeave ? 'leave_sync' : 'manual';

  const attendance = await Attendance.findOneAndUpdate(
    { batch: batchId, student: studentId, date: attendanceDate },
    {
      $set: {
        status: finalStatus,
        remarks: remarks || '',
        attendanceSource: finalSource,
        markedBy: facilitator._id,
        facilitator: facilitator._id
      }
    },
    { new: true, upsert: true }
  ).populate('student', 'name email');

  await logAction({
    action: 'ATTENDANCE_MARKED_SINGLE',
    performedBy: facilitator._id,
    entityType: 'Attendance',
    entityId: attendance._id,
    details: { studentId, date: attendanceDate, status: finalStatus }
  });

  return attendance;
};

export const bulkMarkAttendance = async (facilitator, data) => {
  const { batchId, date, attendanceRecords } = data;
  await checkBatchAccess(facilitator, batchId);

  const attendanceDate = new Date(date);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find leaves for these students on this date
    const studentIds = attendanceRecords.map(r => r.studentId);
    const activeLeaves = await LeaveRequest.find({
      student: { $in: studentIds },
      status: LEAVE_STATUS.APPROVED,
      fromDate: { $lte: attendanceDate },
      toDate: { $gte: attendanceDate }
    }).session(session);

    const leaveSet = new Set(activeLeaves.map(l => l.student.toString()));

    const operations = attendanceRecords.map((record) => {
      const isOnLeave = leaveSet.has(record.studentId);
      const finalStatus = isOnLeave ? ATTENDANCE_STATUS.LEAVE : record.status;
      const finalSource = isOnLeave ? 'leave_sync' : 'manual';

      return {
        updateOne: {
          filter: { batch: batchId, student: record.studentId, date: attendanceDate },
          update: {
            $set: {
              status: finalStatus,
              remarks: record.remarks || '',
              attendanceSource: finalSource,
              markedBy: facilitator._id,
              facilitator: facilitator._id
            },
          },
          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(operations, { session });

    await logAction(
      {
        action: 'ATTENDANCE_MARKED_BULK',
        performedBy: facilitator._id,
        entityType: 'Batch',
        entityId: batchId,
        details: { date: attendanceDate, recordsCount: attendanceRecords.length },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, count: attendanceRecords.length };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateAttendance = async (facilitator, attendanceId, data) => {
  const { status, remarks } = data;
  const attendance = await Attendance.findById(attendanceId).populate('batch');
  
  if (!attendance) throw new ApiError(404, 'Attendance record not found');
  
  if (facilitator.role === ROLES.FACILITATOR && attendance.batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to modify this attendance');
  }

  if (status) attendance.status = status;
  if (remarks !== undefined) attendance.remarks = remarks;
  
  attendance.markedBy = facilitator._id;
  attendance.attendanceSource = 'manual';
  
  await attendance.save();
  return attendance;
};

export const getStudentAttendance = async (user, studentId) => {
  // If user is a student, they can only view their own attendance
  if (user.role === ROLES.STUDENT && user._id.toString() !== studentId) {
    throw new ApiError(403, 'Not authorized to view this attendance');
  }

  return await Attendance.find({ student: studentId })
    .populate('batch', 'name')
    .sort('-date');
};

export const getAttendanceAnalytics = async (user, batchId) => {
  await checkBatchAccess(user, batchId);

  const stats = await Attendance.aggregate([
    { $match: { batch: new mongoose.Types.ObjectId(batchId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    present: 0,
    absent: 0,
    leave: 0,
    half_day: 0,
    total: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  result.presentPercentage = result.total > 0 ? ((result.present + (result.half_day * 0.5)) / result.total) * 100 : 0;

  return result;
};
