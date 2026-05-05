import mongoose from 'mongoose';

const batchConfigSchema = new mongoose.Schema(
  {
    leaveLimit: { type: Number, default: 5, min: 0 },
    leaveLimitPeriod: {
      type: String,
      enum: ['per_module', 'per_course'],
      default: 'per_course',
    },
    reinterviewLimit: { type: Number, default: 2, min: 0 },
    scrumCallTime: { type: String, default: '10:00 AM' },
    workingDays: {
      type: [String],
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('BatchConfig', batchConfigSchema);
