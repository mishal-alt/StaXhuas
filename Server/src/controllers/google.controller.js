import * as googleService from '../services/google.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const initiateGoogleAuth = asyncHandler(async (req, res) => {
  // Pass both batchId and userId in the state param
  const batchId = req.query.state || '';
  const userId = req.user._id;
  const state = `${batchId}:${userId}`;
  
  const url = googleService.getAuthUrl(state);
  res.redirect(url);
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const [batchId, userId] = (state || '').split(':');

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Invalid state parameter' });
  }

  await googleService.handleAuthCallback(code, userId);
  
  // Redirect back to the frontend batch detail page
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/batches/${batchId}?google=connected`);
});
