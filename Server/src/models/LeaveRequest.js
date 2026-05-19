import mongoose from 'mongoose';
import { LEAVE_STATUS, LEAVE_TYPES } from '../utils/constants.js';

const leaveRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    facilitator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    leaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPES),
      required: true
    },
    reason: { type: String, required: true, trim: true },
    
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    
    status: {
      type: String,
      enum: Object.values(LEAVE_STATUS),
      default: LEAVE_STATUS.PENDING,
    },
    remarks: { type: String, trim: true },
    
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    supportingDocument: { type: String }, // URL or path
    attendanceSynced: { type: Boolean, default: false },
    
    priorityLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  },
  { timestamps: true }
);

// Indexes for performance
leaveRequestSchema.index({ student: 1, fromDate: 1, toDate: 1 });
leaveRequestSchema.index({ batch: 1, status: 1 });

export default mongoose.model('LeaveRequest', leaveRequestSchema);
