import { getTicketDetails } from '../services/ticketService.js';

export async function getTicketByRegistrationId(req, res, next) {
  try {
    const { registrationId } = req.params;
    const ticket = await getTicketDetails(registrationId);

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (err) {
    next(err);
  }
}
