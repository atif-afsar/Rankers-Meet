import { Router } from 'express';
import {
  processCheckIn,
  getCheckInStatus,
  undoCheckIn,
} from '../controllers/checkinController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Scanning and check-in require staff/admin auth
router.post('/', protect, processCheckIn);
router.get('/:registrationId', protect, getCheckInStatus);
router.post('/undo/:registrationId', protect, undoCheckIn);

export default router;
