import * as leaveService from '../services/leave.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeaveRequest(req.user, req.body);
  return apiResponse(res, 201, 'Leave request submitted', leave);
});

export const reviewLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.reviewLeaveRequest(req.user, req.params.id, req.body);
  return apiResponse(res, 200, `Leave request ${leave.status}`, leave);
});

export const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await leaveService.getLeaveRequests(req.user, req.query.batchId);
  return apiResponse(res, 200, 'Leaves retrieved successfully', leaves);
});
