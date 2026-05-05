import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isReinterview: { type: Boolean, default: false },
    attemptNumber: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'scored'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Interview', interviewSchema);
