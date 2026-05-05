import mongoose from 'mongoose';

const interviewScoreSchema = new mongoose.Schema(
  {
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    isPass: { type: Boolean, required: true },
    interviewerFeedback: { type: String, required: true },
    scoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('InterviewScore', interviewScoreSchema);
