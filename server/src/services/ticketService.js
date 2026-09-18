import { Registration } from '../models/Registration.js';
import { EventSetting } from '../models/EventSetting.js';
import { generateQrDataUrl } from './qrService.js';

export async function getTicketDetails(registrationId) {
  if (!registrationId) {
    const error = new Error('Registration ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const registration = await Registration.findOne({
    registrationId: registrationId.trim().toUpperCase(),
  });

  if (!registration) {
    const error = new Error('No ticket found with this Registration ID.');
    error.statusCode = 404;
    throw error;
  }

  const qrCode = await generateQrDataUrl(registration.qrToken);
  const eventSettings = await EventSetting.findOne();

  return {
    registrationId: registration.registrationId,
    studentName: registration.studentName,
    parentName: registration.parentName,
    email: registration.email,
    mobileNumber: registration.mobileNumber,
    classCourse: registration.classCourse,
    exam: registration.exam,
    rank: registration.rank,
    schoolCollege: registration.schoolCollege,
    numberOfGuests: registration.numberOfGuests,
    status: registration.status,
    checkedInAt: registration.checkedInAt,
    qrCode,
    event: {
      name: eventSettings?.eventName || 'Rankers Meet 2026',
      tagline: eventSettings?.tagline || 'Honoring The Commerce Champions of Yasir Ali Classes',
      organization: eventSettings?.organization || 'Yasir Ali Classes',
      date: eventSettings?.eventDate || 'Saturday, October 3, 2026',
      time: eventSettings?.eventTime || '10:00 AM - 02:00 PM IST',
      venue: eventSettings?.venue || 'Grand Auditorium, Aligarh Cultural Complex',
      address: eventSettings?.address || 'Grand Bazaar, 1st Floor, Lal Diggi Road, Aligarh, UP 202002',
      announcement: eventSettings?.announcement || '',
    },
  };
}
