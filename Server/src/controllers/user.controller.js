import User from '../models/User.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return apiResponse(res, 404, 'User not found');
  return apiResponse(res, 200, 'User retrieved successfully', user);
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('name email role');
  return apiResponse(res, 200, 'Users retrieved successfully', users);
});
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return apiResponse(res, 200, 'User updated successfully', user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, 'User deleted successfully');
});
