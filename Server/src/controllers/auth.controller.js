import * as authService from '../services/auth.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

export const acceptInvite = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.acceptInvite(token, password);

  // Set refresh token in HTTP-only cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return apiResponse(res, 201, 'Account created successfully', { user, accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return apiResponse(res, 200, 'Login successful', { user, accessToken });
});

export const me = asyncHandler(async (req, res) => {
  return apiResponse(res, 200, 'User profile retrieved', req.user);
});
