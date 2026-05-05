import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import Batch from '../models/Batch.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const markBatchAttendance = async (facilitator, data) => {
  const { batch: batchId, date, records } = data;

  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (facilitator.role === ROLES.FACILITATOR && batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to mark attendance for this batch');
  }

  // Normalize date to start of day
  const attendanceDate = new Date(date);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const operations = records.map((record) => ({
      updateOne: {
        filter: { student: record.student, date: attendanceDate },
        update: {
          $set: {
            student: record.student,
            batch: batchId,
            date: attendanceDate,
            status: record.status,
            markedBy: facilitator._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations, { session });

    await logAction(
      {
        action: 'ATTENDANCE_MARKED',
        performedBy: facilitator._id,
        entityType: 'Batch',
        entityId: batchId,
        details: { date: attendanceDate, recordsCount: records.length },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, count: records.length };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getBatchAttendance = async (user, batchId, date) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (user.role === ROLES.FACILITATOR && batch.facilitator.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view attendance for this batch');
  }

  const query = { batch: batchId };
  if (date) {
    const queryDate = new Date(date);
    queryDate.setUTCHours(0, 0, 0, 0);
    query.date = queryDate;
  }

  return await Attendance.find(query)
    .populate('student', 'name email')
    .sort('-date');
};
