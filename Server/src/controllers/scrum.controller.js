import * as scrumService from '../services/scrum.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const logScrum = asyncHandler(async (req, res) => {
  const scrum = await scrumService.logScrumCall(req.user, req.body);
  return apiResponse(res, 201, 'Scrum call logged successfully', scrum);
});

export const getScrums = asyncHandler(async (req, res) => {
  const scrums = await scrumService.getScrumCallsByBatch(req.user, req.params.batchId);
  return apiResponse(res, 200, 'Scrum calls retrieved successfully', scrums);
});
