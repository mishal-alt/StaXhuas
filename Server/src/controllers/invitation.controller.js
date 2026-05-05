import * as invitationService from '../services/invitation.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const invitation = await invitationService.createInvitation(req.user, req.body);
  return apiResponse(res, 201, 'Invitation sent successfully', invitation);
});

export const list = asyncHandler(async (req, res) => {
  const invitations = await invitationService.getInvitations(req.user);
  return apiResponse(res, 200, 'Invitations retrieved successfully', invitations);
});

export const revoke = asyncHandler(async (req, res) => {
  const invitation = await invitationService.revokeInvitation(req.user, req.params.id);
  return apiResponse(res, 200, 'Invitation revoked successfully', invitation);
});
