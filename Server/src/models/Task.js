import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['personal', 'technical'],
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
