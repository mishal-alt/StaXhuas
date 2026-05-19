import * as attendanceService from '../services/attendance.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAttendanceForDate = asyncHandler(async (req, res) => {
  const { batchId, date } = req.params;
  const attendance = await attendanceService.getAttendanceForDate(req.user, batchId, date);
  return apiResponse(res, 200, 'Attendance retrieved successfully', attendance);
});

export const markSingleAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.markSingleAttendance(req.user, req.body);
  return apiResponse(res, 200, 'Attendance marked successfully', result);
});

export const bulkMarkAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.bulkMarkAttendance(req.user, req.body);
  return apiResponse(res, 200, 'Bulk attendance marked successfully', result);
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await attendanceService.updateAttendance(req.user, id, req.body);
  return apiResponse(res, 200, 'Attendance updated successfully', result);
});

export const getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const result = await attendanceService.getStudentAttendance(req.user, studentId);
  return apiResponse(res, 200, 'Student attendance retrieved successfully', result);
});

export const getAttendanceAnalytics = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const result = await attendanceService.getAttendanceAnalytics(req.user, batchId);
  return apiResponse(res, 200, 'Attendance analytics retrieved successfully', result);
});
