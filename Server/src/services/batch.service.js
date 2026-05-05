import mongoose from 'mongoose';
import Batch from '../models/Batch.js';
import BatchConfig from '../models/BatchConfig.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { ApiError } from '../utils/apiError.js';
import { logAction } from './audit.service.js';
import { ROLES } from '../utils/constants.js';

export const createBatch = async (user, data) => {
  const { name, course: courseId, facilitator: facilitatorId, startDate, config: configData } = data;

  const existing = await Batch.findOne({ name });
  if (existing) throw new ApiError(400, 'Batch name already in use');

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const facilitator = await User.findOne({ _id: facilitatorId, role: ROLES.FACILITATOR });
  if (!facilitator) throw new ApiError(404, 'Facilitator not found or invalid role');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const config = new BatchConfig(configData || {});
    await config.save({ session });

    const batch = new Batch({
      name,
      course: courseId,
      facilitator: facilitatorId,
      config: config._id,
      startDate,
    });

    await batch.save({ session });

    await logAction(
      {
        action: 'BATCH_CREATED',
        performedBy: user._id,
        entityType: 'Batch',
        entityId: batch._id,
        details: { name, course: courseId, facilitator: facilitatorId },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return batch;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getBatches = async (user) => {
  const filter = user.role === ROLES.FACILITATOR ? { facilitator: user._id } : {};
  return await Batch.find(filter)
    .populate('course', 'name durationMonths')
    .populate('facilitator', 'name email')
    .populate('config');
};

export const getBatchById = async (user, batchId) => {
  const batch = await Batch.findById(batchId)
    .populate('course', 'name durationMonths')
    .populate('facilitator', 'name email')
    .populate('config');

  if (!batch) throw new ApiError(404, 'Batch not found');

  // Enforce Facilitator can only view their own batches
  if (user.role === ROLES.FACILITATOR && batch.facilitator._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You do not have access to this batch');
  }

  return batch;
};

export const updateBatchConfig = async (user, batchId, data) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  const config = await BatchConfig.findByIdAndUpdate(batch.config, data, { new: true });

  await logAction({
    action: 'BATCH_CONFIG_UPDATED',
    performedBy: user._id,
    entityType: 'BatchConfig',
    entityId: config._id,
    details: data,
  });

  return config;
};
