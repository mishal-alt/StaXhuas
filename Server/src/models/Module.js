import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    orderIndex: { type: Number, required: true },
    durationWeeks: { type: Number, required: true, min: 1 },
    // A module has tasks, but tasks reference the module (one-to-many)
  },
  { timestamps: true }
);

export default mongoose.model('Module', moduleSchema);
