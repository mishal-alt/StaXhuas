import cron from 'node-cron';
import Invitation from '../models/Invitation.js';
import { INVITATION_STATUS } from '../utils/constants.js';
import { logAction } from '../services/audit.service.js';

export const startJobs = () => {
  // Run every day at midnight server time
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running expired invitations check...');
    
    try {
      const now = new Date();
      
      const expiredInvites = await Invitation.find({
        status: INVITATION_STATUS.PENDING,
        expiresAt: { $lt: now }
      });

      if (expiredInvites.length === 0) {
        return;
      }

      for (const invite of expiredInvites) {
        invite.status = INVITATION_STATUS.EXPIRED;
        await invite.save();

        await logAction({
          action: 'INVITATION_EXPIRED_CRON',
          performedBy: null, // System action
          entityType: 'Invitation',
          entityId: invite._id,
          details: { email: invite.email, expiredAt: now }
        });
      }

      console.log(`[CRON] Successfully expired ${expiredInvites.length} invitations.`);
    } catch (error) {
      console.error('[CRON] Error running expire invitations job:', error);
    }
  });
  
  console.log('[CRON] Background jobs initialized.');
};
