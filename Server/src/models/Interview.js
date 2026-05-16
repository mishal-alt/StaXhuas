import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: String, required: true, trim: true },
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned later
    facilitator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    mode: { type: String, enum: ['online', 'offline'], required: true },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'passed', 'failed', 're_interview_required'],
      default: 'scheduled'
    },
    score: { type: Number, min: 0 },
    maxScore: { type: Number, default: 40 },
    reviewScore: { type: Number, min: 0, max: 10 },
    taskScore: { type: Number, min: 0, max: 10 },
    attendanceScore: { type: Number, min: 0, max: 10 },
    disciplineScore: { type: Number, min: 0, max: 10 },
    percentage: { type: Number, min: 0, max: 100 },
    facilitatorEvaluation: { type: String },
    interviewerFeedback: { type: String },
    reInterviewAttempt: { type: Number, default: 0 },
    maxReInterviewLimit: { type: Number, default: 2 },
    remarks: { type: String },
    completedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meetingLink: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate active interviews for the same student and module (unless re-interview)
// A student shouldn't have multiple 'scheduled' or 'in_progress' interviews for the same module.
interviewSchema.index({ student: 1, module: 1, status: 1 });

export default mongoose.model('Interview', interviewSchema);
