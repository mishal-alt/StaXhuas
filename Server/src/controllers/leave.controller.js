import * as leaveService from '../services/leave.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

export const createLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeaveRequest(req.user._id, req.body);
  return apiResponse(res, 201, 'Leave request created successfully', leave);
});

export const getLeaveRequests = asyncHandler(async (req, res) => {
  console.log('--- GET /leaves ---');
  console.log('Logged-in User:', req.user ? { _id: req.user._id, email: req.user.email, role: req.user.role } : 'None');
  console.log('Incoming Query/Filters:', req.query);
  const leaves = await leaveService.getLeaveRequests(req.user, req.query);
  console.log('Fetched Leaves Count:', leaves ? leaves.length : 0);
  console.log('-------------------');
  return apiResponse(res, 200, 'Leave requests retrieved successfully', leaves);
});

export const approveLeaveRequest = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const leave = await leaveService.reviewLeaveRequest(req.user, req.params.id, 'approved', remarks);
  return apiResponse(res, 200, 'Leave request approved successfully', leave);
});

export const rejectLeaveRequest = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const leave = await leaveService.reviewLeaveRequest(req.user, req.params.id, 'rejected', remarks);
  return apiResponse(res, 200, 'Leave request rejected successfully', leave);
});

export const cancelLeaveRequest = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const leave = await leaveService.reviewLeaveRequest(req.user, req.params.id, 'cancelled', remarks);
  return apiResponse(res, 200, 'Leave request cancelled successfully', leave);
});

export const getStudentLeaveHistory = asyncHandler(async (req, res) => {
  const leaves = await leaveService.getStudentLeaveHistory(req.params.studentId);
  return apiResponse(res, 200, 'Student leave history retrieved successfully', leaves);
});

export const getLeaveAnalytics = asyncHandler(async (req, res) => {
  const analytics = await leaveService.getLeaveAnalytics(req.params.batchId);
  return apiResponse(res, 200, 'Leave analytics retrieved successfully', analytics);
});
