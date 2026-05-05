import mongoose from 'mongoose';

const scrumCallEntrySchema = new mongoose.Schema(
  {
    scrumCall: { type: mongoose.Schema.Types.ObjectId, ref: 'ScrumCall', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPresent: { type: Boolean, required: true, default: true },
    progressUpdate: { type: String },
    blockers: { type: String },
    actionItems: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ScrumCallEntry', scrumCallEntrySchema);
