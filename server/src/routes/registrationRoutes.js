import { Router } from 'express';
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  resendEmail,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', createRegistration);
router.get('/', protect, getRegistrations);
router.get('/:id', protect, getRegistrationById);
router.post('/:id/resend-email', protect, resendEmail);

export default router;
