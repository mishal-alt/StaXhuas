import mongoose from 'mongoose';
import User from '../models/User.js';
import Batch from '../models/Batch.js';
import Course from '../models/Course.js';
import Invitation from '../models/Invitation.js';
import Attendance from '../models/Attendance.js';
import InterviewScore from '../models/InterviewScore.js';
import { ROLES, STUDENT_STATUS, ATTENDANCE_STATUS } from '../utils/constants.js';

export const getAdminOverview = async () => {
  // 1. Basic Counts
  const [totalStudents, totalFacilitators, activeBatches, totalCourses] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.FACILITATOR }),
    Batch.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
  ]);

  // 2. Student Status Distribution
  const studentStatuses = await User.aggregate([
    { $match: { role: ROLES.STUDENT } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const statusDistribution = {
    [STUDENT_STATUS.ACTIVE]: 0,
    [STUDENT_STATUS.DISCONTINUED]: 0,
    [STUDENT_STATUS.TERMINATED]: 0,
  };
  studentStatuses.forEach(stat => {
    if (statusDistribution[stat._id] !== undefined) {
      statusDistribution[stat._id] = stat.count;
    }
  });

  // 3. Invitation Activity
  const invitationStats = await Invitation.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const invites = { pending: 0, accepted: 0, expired: 0, revoked: 0 };
  invitationStats.forEach(stat => {
    invites[stat._id] = stat.count;
  });

  return {
    kpis: {
      totalStudents,
      totalFacilitators,
      activeBatches,
      totalCourses,
    },
    students: statusDistribution,
    invitations: invites,
  };
};

export const getBatchAnalytics = async (batchId) => {
  const batchObjectId = new mongoose.Types.ObjectId(batchId);

  // 1. Attendance Distribution for the batch
  const attendanceStats = await Attendance.aggregate([
    { $match: { batch: batchObjectId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const attendance = { present: 0, absent: 0, leave: 0, half_day: 0 };
  let totalAttendanceDays = 0;
  
  attendanceStats.forEach(stat => {
    attendance[stat._id] = stat.count;
    totalAttendanceDays += stat.count;
  });

  const attendanceRate = totalAttendanceDays > 0 
    ? Math.round((attendance.present / totalAttendanceDays) * 100) 
    : 0;

  // 2. Interview Pass/Fail Trends
  const interviewStats = await InterviewScore.aggregate([
    {
      $lookup: {
        from: 'interviews',
        localField: 'interview',
        foreignField: '_id',
        as: 'interviewDoc'
      }
    },
    { $unwind: '$interviewDoc' },
    { $match: { 'interviewDoc.batch': batchObjectId } },
    { 
      $group: { 
        _id: '$isPass', 
        count: { $sum: 1 } 
      } 
    }
  ]);

  const interviews = { pass: 0, fail: 0 };
  interviewStats.forEach(stat => {
    if (stat._id === true) interviews.pass = stat.count;
    else interviews.fail = stat.count;
  });

  // 3. Students approaching limits (Placeholder for complex logic)
  // To get students approaching leave limits, we'd need to aggregate leave requests per student
  // and join with batch config. For simplicity, we just return the aggregates above.

  return {
    attendance: {
      distribution: attendance,
      rate: attendanceRate,
    },
    interviews,
  };
};
