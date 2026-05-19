import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Batch from './src/models/Batch.js';
import LeaveRequest from './src/models/LeaveRequest.js';
import Attendance from './src/models/Attendance.js';
import { ROLES, LEAVE_STATUS, LEAVE_TYPES, ATTENDANCE_STATUS } from './src/utils/constants.js';

dotenv.config();

const seedLeaves = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding leave requests...');

    // 1. Fetch Batch B-1
    const batch = await Batch.findOne({ name: 'B-1' });
    if (!batch) {
      throw new Error('Batch B-1 not found in the database. Please ensure the batch exists first.');
    }
    console.log(`Found Batch: ${batch.name} (ID: ${batch._id})`);

    // 2. Fetch facilitator of batch B-1
    const facilitator = await User.findById(batch.facilitator);
    if (!facilitator) {
      throw new Error(`Facilitator with ID ${batch.facilitator} not found for Batch B-1.`);
    }
    console.log(`Found Facilitator: ${facilitator.name} (ID: ${facilitator._id})`);

    // 3. Fetch 4 existing students from B-1 batch
    const students = await User.find({ role: ROLES.STUDENT, batch: batch._id }).limit(4);
    if (students.length < 4) {
      throw new Error(`Expected at least 4 students in Batch B-1, but found only ${students.length}.`);
    }

    console.log(`\nUsing the following 4 students for leave testing:`);
    students.forEach((s, idx) => {
      console.log(`Student ${idx + 1}: ${s.name} (ID: ${s._id}, Email: ${s.email})`);
    });

    // 4. Delete existing leave requests for this batch
    const deleteLeavesResult = await LeaveRequest.deleteMany({ batch: batch._id });
    console.log(`\nDeleted ${deleteLeavesResult.deletedCount} old leave requests for Batch B-1.`);

    // Delete existing leave-sync attendance records for these 4 students to start fresh
    const studentIds = students.map(s => s._id);
    const deleteAttendanceResult = await Attendance.deleteMany({
      batch: batch._id,
      student: { $in: studentIds },
      attendanceSource: 'leave_sync'
    });
    console.log(`Deleted ${deleteAttendanceResult.deletedCount} old leave-synced attendance records.`);

    // Helper to normalize dates to UTC midnight
    const normalizeDate = (dateStr) => {
      const d = new Date(dateStr);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    };

    // 5. Define Leave Requests
    const leaveData = [
      // Case 1: Pending Leave
      {
        student: students[0]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.SICK,
        reason: 'Experiencing high fever, body aches, and flu-like symptoms. Medical certificate will be provided if needed.',
        fromDate: normalizeDate('2026-05-21'),
        toDate: normalizeDate('2026-05-21'),
        totalDays: 1,
        status: LEAVE_STATUS.PENDING,
        remarks: '',
        appliedAt: normalizeDate('2026-05-19'),
        attendanceSynced: false,
        priorityLevel: 'medium'
      },
      // Case 2: Approved Leave (single day)
      {
        student: students[1]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.CASUAL,
        reason: 'Attending my elder sister\'s wedding ceremony. Need to travel out of town.',
        fromDate: normalizeDate('2026-05-12'),
        toDate: normalizeDate('2026-05-12'),
        totalDays: 1,
        status: LEAVE_STATUS.APPROVED,
        remarks: 'Approved. Please make sure to catch up on the modules missed.',
        appliedAt: normalizeDate('2026-05-09'),
        approvedAt: normalizeDate('2026-05-10'),
        approvedBy: facilitator._id,
        attendanceSynced: true,
        priorityLevel: 'low'
      },
      // Case 3: Rejected Leave
      {
        student: students[2]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.PERSONAL,
        reason: 'Routine personal work at home.',
        fromDate: normalizeDate('2026-05-08'),
        toDate: normalizeDate('2026-05-08'),
        totalDays: 1,
        status: LEAVE_STATUS.REJECTED,
        remarks: 'Rejected. Sprint planning and project reviews are scheduled for this day. Attendance is mandatory.',
        appliedAt: normalizeDate('2026-05-05'),
        rejectedAt: normalizeDate('2026-05-06'),
        rejectedBy: facilitator._id,
        attendanceSynced: false,
        priorityLevel: 'low'
      },
      // Case 4: Multi-Day Leave (Approved, 3 days)
      {
        student: students[3]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.EMERGENCY,
        reason: 'Family medical emergency. Grandfather admitted to the hospital, urgent travel back home is required.',
        fromDate: normalizeDate('2026-05-15'),
        toDate: normalizeDate('2026-05-17'),
        totalDays: 3,
        status: LEAVE_STATUS.APPROVED,
        remarks: 'Approved. Family comes first. Wishing him a speedy recovery.',
        appliedAt: normalizeDate('2026-05-13'),
        approvedAt: normalizeDate('2026-05-14'),
        approvedBy: facilitator._id,
        attendanceSynced: true,
        priorityLevel: 'high'
      },
      // Additional Case: Approved Sick Leave
      {
        student: students[1]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.SICK,
        reason: 'Dental appointment for root canal treatment and follow-up.',
        fromDate: normalizeDate('2026-05-19'),
        toDate: normalizeDate('2026-05-19'),
        totalDays: 1,
        status: LEAVE_STATUS.APPROVED,
        remarks: 'Approved. Get well soon.',
        appliedAt: normalizeDate('2026-05-17'),
        approvedAt: normalizeDate('2026-05-18'),
        approvedBy: facilitator._id,
        attendanceSynced: true,
        priorityLevel: 'low'
      },
      // Additional Case: Pending Leave (Multi-Day)
      {
        student: students[3]._id,
        batch: batch._id,
        facilitator: facilitator._id,
        leaveType: LEAVE_TYPES.PERSONAL,
        reason: 'Need to travel home for renewing passport/visa and completing biometric verification.',
        fromDate: normalizeDate('2026-05-25'),
        toDate: normalizeDate('2026-05-26'),
        totalDays: 2,
        status: LEAVE_STATUS.PENDING,
        remarks: '',
        appliedAt: normalizeDate('2026-05-19'),
        attendanceSynced: false,
        priorityLevel: 'medium'
      }
    ];

    // 6. Insert Leave Requests and Sync Approved Leaves to Attendance
    for (const data of leaveData) {
      const leave = new LeaveRequest(data);
      await leave.save();
      console.log(`Seeded ${leave.leaveType} leave request for ${students.find(s => s._id.toString() === leave.student.toString()).name} (Status: ${leave.status}, Days: ${leave.totalDays})`);

      // If approved, sync to attendance
      if (leave.status === LEAVE_STATUS.APPROVED) {
        const start = new Date(leave.fromDate);
        const end = new Date(leave.toDate);
        const operations = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const currentDate = new Date(d);
          operations.push({
            updateOne: {
              filter: { student: leave.student, batch: leave.batch, date: currentDate },
              update: {
                $set: {
                  student: leave.student,
                  batch: leave.batch,
                  date: currentDate,
                  status: ATTENDANCE_STATUS.LEAVE,
                  facilitator: facilitator._id,
                  attendanceSource: 'leave_sync',
                  remarks: `Leave approved: ${leave.leaveType}`
                },
              },
              upsert: true,
            },
          });
        }

        if (operations.length > 0) {
          await Attendance.bulkWrite(operations);
          console.log(`  -> Synced ${operations.length} attendance record(s) for the approved leave.`);
        }
      }
    }

    console.log('\nLeave requests and attendance records seeded successfully!');
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedLeaves();
