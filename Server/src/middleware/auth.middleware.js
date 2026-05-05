import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, token failed or missing', 'AUTH_ERROR');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      throw new ApiError(401, 'Not authorized, user not found', 'AUTH_ERROR');
    }
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token failed', 'AUTH_ERROR');
  }
});

export const authMiddleware = protect;

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action', 'AUTH_ERROR');
    }
    next();
  };
};

