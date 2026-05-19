import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import Batch from './src/models/Batch.js';
import BatchConfig from './src/models/BatchConfig.js';
import { ROLES } from './src/utils/constants.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // 1. Helper to seed a user
    const seedUser = async (userData) => {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User ${userData.email} already exists. Skipping.`);
        return existing;
      }
      const user = new User(userData);
      await user.save();
      console.log(`User seeded: ${userData.email} / password123`);
      return user;
    };

    // 2. Seed Users
    await seedUser({
      name: 'Staxhaus Admin',
      email: 'admin@staxhaus.com',
      password: 'password123',
      role: ROLES.ADMIN,
    });

    const facilitator = await seedUser({
      name: 'Test Facilitator',
      email: 'facilitator@staxhaus.com',
      password: 'password123',
      role: ROLES.FACILITATOR,
    });

    await seedUser({
      name: 'Test Student',
      email: 'student@staxhaus.com',
      password: 'password123',
      role: ROLES.STUDENT,
    });

    await seedUser({
      name: 'Test Interviewer',
      email: 'interviewer@staxhaus.com',
      password: 'password123',
      role: ROLES.INTERVIEWER,
    });

    // 3. Seed a Course
    let course = await Course.findOne({ name: 'Full Stack Development' });
    if (!course) {
      course = new Course({
        name: 'Full Stack Development',
        description: 'Master the MERN stack and professional web development.',
        durationMonths: 6,
      });
      await course.save();
      console.log('Course seeded: Full Stack Development');
    }

    // 4. Seed a Batch Config
    let config = await BatchConfig.findOne({});
    if (!config) {
      config = new BatchConfig({
        leaveLimit: 10,
        leaveLimitPeriod: 'per_course',
        reinterviewLimit: 3,
        scrumCallTime: '09:30 AM',
      });
      await config.save();
      console.log('Batch Config seeded');
    }

    // 5. Seed a Batch linked to the facilitator
    const batchName = 'FSD-COHORT-2026';
    let batch = await Batch.findOne({ name: batchName });
    if (!batch) {
      batch = new Batch({
        name: batchName,
        course: course._id,
        facilitator: facilitator._id,
        config: config._id,
        startDate: new Date(),
      });
      await batch.save();
      console.log(`Batch seeded: ${batchName} (Facilitator: ${facilitator.email})`);
    }

    // 6. Seed multiple students in this batch
    const studentsData = [
      { name: 'Ahmed Khan', email: 'ahmed@staxhaus.com', password: 'password123', role: ROLES.STUDENT, batch: batch._id },
      { name: 'Sara Ali', email: 'sara@staxhaus.com', password: 'password123', role: ROLES.STUDENT, batch: batch._id },
      { name: 'Zaid Mirza', email: 'zaid@staxhaus.com', password: 'password123', role: ROLES.STUDENT, batch: batch._id },
      { name: 'Fatima Noor', email: 'fatima@staxhaus.com', password: 'password123', role: ROLES.STUDENT, batch: batch._id },
      { name: 'Umar Farooq', email: 'umar@staxhaus.com', password: 'password123', role: ROLES.STUDENT, batch: batch._id },
    ];

    const seededStudents = [];
    for (const sData of studentsData) {
      const student = await seedUser(sData);
      seededStudents.push(student);
    }

    // 7. Seed Leave Requests for these students
    const LeaveRequest = (await import('./src/models/LeaveRequest.js')).default;
    
    const leavesData = [
      {
        student: seededStudents[0]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: 'sick',
        reason: 'Running high fever. Doctor advised complete bed rest for 2 days.',
        fromDate: new Date('2026-05-08'),
        toDate: new Date('2026-05-09'),
        totalDays: 2,
        status: 'pending',
        appliedAt: new Date('2026-05-07'),
        priorityLevel: 'medium'
      },
      {
        student: seededStudents[1]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: 'casual',
        reason: 'Family function attendance required.',
        fromDate: new Date('2026-05-12'),
        toDate: new Date('2026-05-12'),
        totalDays: 1,
        status: 'approved',
        appliedAt: new Date('2026-05-10'),
        approvedBy: facilitator._id,
        approvedAt: new Date('2026-05-10'),
        priorityLevel: 'low',
        attendanceSynced: true
      },
      {
        student: seededStudents[2]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: 'emergency',
        reason: 'Immediate family emergency requiring out-of-city travel.',
        fromDate: new Date('2026-05-06'),
        toDate: new Date('2026-05-07'),
        totalDays: 2,
        status: 'rejected',
        appliedAt: new Date('2026-05-05'),
        rejectedBy: facilitator._id,
        rejectedAt: new Date('2026-05-05'),
        remarks: 'Batch schedules cannot accommodate this absence without documentation.',
        priorityLevel: 'high'
      },
      {
        student: seededStudents[3]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: 'sick',
        reason: 'Scheduled dental surgery and recovery period.',
        fromDate: new Date('2026-05-15'),
        toDate: new Date('2026-05-16'),
        totalDays: 2,
        status: 'pending',
        appliedAt: new Date('2026-05-13'),
        priorityLevel: 'low'
      },
      {
        student: seededStudents[4]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: 'casual',
        reason: 'Personal family obligation.',
        fromDate: new Date('2026-05-20'),
        toDate: new Date('2026-05-20'),
        totalDays: 1,
        status: 'pending',
        appliedAt: new Date('2026-05-18'),
        priorityLevel: 'low'
      }
    ];

    await LeaveRequest.deleteMany({ batch: batch._id });
    console.log('Old batch leaves deleted.');

    for (const lData of leavesData) {
      const leave = new LeaveRequest(lData);
      await leave.save();
      console.log(`Seeded ${lData.leaveType} leave for student: ${leave.student}`);
    }

    console.log('\nSeeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

