import express from 'express';
import * as googleController from '../controllers/google.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// The state param can carry the batchId so we know where to redirect back to
router.get('/', protect, googleController.initiateGoogleAuth);
router.get('/callback', googleController.googleAuthCallback);

export default router;
