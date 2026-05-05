import * as batchService from '../services/batch.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.createBatch(req.user, req.body);
  return apiResponse(res, 201, 'Batch created successfully', batch);
});

export const getBatches = asyncHandler(async (req, res) => {
  const batches = await batchService.getBatches(req.user);
  return apiResponse(res, 200, 'Batches retrieved successfully', batches);
});

export const getBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.getBatchById(req.user, req.params.id);
  return apiResponse(res, 200, 'Batch retrieved successfully', batch);
});

export const updateConfig = asyncHandler(async (req, res) => {
  const config = await batchService.updateBatchConfig(req.user, req.params.id, req.body);
  return apiResponse(res, 200, 'Batch configuration updated successfully', config);
});
