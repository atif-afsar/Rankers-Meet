import { Router } from 'express';
import {
  exportRegistrations,
  exportCheckinHistory,
  getAttendanceReport,
} from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All export & reporting endpoints require authentication
router.get('/registrations', protect, exportRegistrations);
router.get('/checkin-history', protect, exportCheckinHistory);
router.get('/attendance-report', protect, getAttendanceReport);

export default router;
