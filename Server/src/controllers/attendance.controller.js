import * as attendanceService from '../services/attendance.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const markAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.markBatchAttendance(req.user, req.body);
  return apiResponse(res, 201, 'Attendance marked successfully', result);
});

export const getAttendance = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { date } = req.query;
  const attendance = await attendanceService.getBatchAttendance(req.user, batchId, date);
  return apiResponse(res, 200, 'Attendance retrieved successfully', attendance);
});
