import mongoose from 'mongoose';
import { ATTENDANCE_STATUS } from '../utils/constants.js';

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    facilitator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: true,
    },
    remarks: { type: String, default: '' },
    attendanceSource: {
      type: String,
      enum: ['manual', 'scrum_sync', 'leave_sync'],
      default: 'manual'
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
  },
  { timestamps: true }
);

// One attendance record per student per date per batch
attendanceSchema.index({ batch: 1, student: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
