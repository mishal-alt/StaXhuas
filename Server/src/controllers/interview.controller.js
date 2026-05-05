import * as interviewService from '../services/interview.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const schedule = asyncHandler(async (req, res) => {
  const interview = await interviewService.scheduleInterview(req.user, req.body);
  return apiResponse(res, 201, 'Interview scheduled successfully', interview);
});

export const score = asyncHandler(async (req, res) => {
  const scoreResult = await interviewService.scoreInterview(req.user, req.params.id, req.body);
  return apiResponse(res, 201, 'Interview score recorded', scoreResult);
});

export const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await interviewService.getInterviews(req.user, req.query.batchId);
  return apiResponse(res, 200, 'Interviews retrieved successfully', interviews);
});
