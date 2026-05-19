import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Batch from './src/models/Batch.js';
import User from './src/models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    const facilitators = await User.find({ role: 'facilitator' });
    console.log('\n=== FACILITATORS ===');
    facilitators.forEach(f => {
      console.log(`Facilitator ID: ${f._id} | Name: ${f.name} | Email: ${f.email}`);
    });

    const batches = await Batch.find().populate('facilitator');
    console.log('\n=== BATCHES ===');
    batches.forEach(b => {
      console.log(`Batch ID: ${b._id} | Name: ${b.name} | Facilitator: ${b.facilitator?.name} (${b.facilitator?._id})`);
    });

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
