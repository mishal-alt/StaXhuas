import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Batch from './src/models/Batch.js';
import User from './src/models/User.js';
import LeaveRequest from './src/models/LeaveRequest.js';
import { getLeaveRequests } from './src/services/leave.service.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // Let's get the Test Facilitator
    const facilitator = await User.findOne({ email: 'facilitator@staxhaus.com' });
    console.log('Facilitator:', facilitator.name, facilitator._id, facilitator.role);

    // Let's call getLeaveRequests for this facilitator and batch B-1
    const batch = await Batch.findOne({ name: 'B-1' });
    console.log('Batch B-1:', batch._id);

    const leaves = await getLeaveRequests(facilitator, { batch: batch._id.toString() });
    console.log('Number of leaves retrieved:', leaves.length);
    leaves.forEach((l, idx) => {
      console.log(`[${idx}] Student: ${l.student?.name} (${l.student?._id}) | Batch: ${l.batch?.name} (${l.batch?._id}) | Type: ${l.leaveType} | Status: ${l.status}`);
    });

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
