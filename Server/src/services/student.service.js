import mongoose from 'mongoose';
import User from '../models/User.js';
import Batch from '../models/Batch.js';
import EnrollmentStatusHistory from '../models/EnrollmentStatusHistory.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const changeStudentStatus = async (changer, studentId, data) => {
  const { status: newStatus, remark } = data;

  const student = await User.findOne({ _id: studentId, role: ROLES.STUDENT });
  if (!student) throw new ApiError(404, 'Student not found');

  if (!student.batch) {
    throw new ApiError(400, 'Student is not assigned to any batch');
  }

  // Facilitator authorization check
  if (changer.role === ROLES.FACILITATOR) {
    const batch = await Batch.findById(student.batch);
    if (!batch || batch.facilitator.toString() !== changer._id.toString()) {
      throw new ApiError(403, 'Not authorized to change status of this student');
    }
  }

  const previousStatus = student.status;
  if (previousStatus === newStatus) {
    throw new ApiError(400, `Student is already marked as ${newStatus}`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update Student User Document
    student.status = newStatus;
    await student.save({ session });

    // 2. Log to Status History
    const history = new EnrollmentStatusHistory({
      student: studentId,
      batch: student.batch,
      previousStatus,
      newStatus,
      changedBy: changer._id,
      remark,
    });
    await history.save({ session });

    // 3. Log to Audit Log
    await logAction(
      {
        action: 'STUDENT_STATUS_CHANGED',
        performedBy: changer._id,
        entityType: 'User',
        entityId: studentId,
        details: { previousStatus, newStatus, remark, batch: student.batch },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return student;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getStudentsByBatch = async (user, batchId) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (user.role === ROLES.FACILITATOR && batch.facilitator.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view students in this batch');
  }

  const students = await User.find({ role: ROLES.STUDENT, batch: batchId }).select('-password -refreshToken');
  return students;
};
