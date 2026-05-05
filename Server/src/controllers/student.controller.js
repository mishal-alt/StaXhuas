import * as studentService from '../services/student.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const changeStatus = asyncHandler(async (req, res) => {
  const student = await studentService.changeStudentStatus(req.user, req.params.id, req.body);
  return apiResponse(res, 200, `Student status updated to ${student.status}`, { status: student.status });
});

export const getByBatch = asyncHandler(async (req, res) => {
  const students = await studentService.getStudentsByBatch(req.user, req.params.batchId);
  return apiResponse(res, 200, 'Students retrieved successfully', students);
});
