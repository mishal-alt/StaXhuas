import * as reportService from '../services/report.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminOverview = asyncHandler(async (req, res) => {
  const data = await reportService.getAdminOverview();
  return apiResponse(res, 200, 'Admin overview retrieved successfully', data);
});

export const getBatchAnalytics = asyncHandler(async (req, res) => {
  const data = await reportService.getBatchAnalytics(req.params.batchId);
  return apiResponse(res, 200, 'Batch analytics retrieved successfully', data);
});
