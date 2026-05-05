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

    console.log('\nSeeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

