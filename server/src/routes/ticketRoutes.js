import { Router } from 'express';
import { getTicketByRegistrationId } from '../controllers/ticketController.js';

const router = Router();

router.get('/:registrationId', getTicketByRegistrationId);

export default router;
