import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Batch from './src/models/Batch.js';
import User from './src/models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    const batches = await Batch.find();
    console.log('\n=== BATCHES ===');
    batches.forEach(b => {
      console.log(`Batch ID: ${b._id} | Name: ${b.name}`);
    });

    const students = await User.find({ role: 'student' });
    console.log('\n=== STUDENTS ===');
    students.forEach(s => {
      console.log(`Student Name: ${s.name} | Batch Link: ${s.batch}`);
    });

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
