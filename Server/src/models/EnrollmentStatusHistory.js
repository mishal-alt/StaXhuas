import mongoose from 'mongoose';
import { STUDENT_STATUS } from '../utils/constants.js';

const statusHistorySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    previousStatus: { type: String, enum: Object.values(STUDENT_STATUS), required: true },
    newStatus: { type: String, enum: Object.values(STUDENT_STATUS), required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remark: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('EnrollmentStatusHistory', statusHistorySchema);
