import mongoose from 'mongoose';
import { STUDENT_STATUS } from '../utils/constants.js';

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    status: {
      type: String,
      enum: Object.values(STUDENT_STATUS),
      default: STUDENT_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Enrollment', enrollmentSchema);
