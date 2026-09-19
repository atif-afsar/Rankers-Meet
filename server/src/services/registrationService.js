import { Registration } from '../models/Registration.js';
import { EventSetting } from '../models/EventSetting.js';
import { getNextSequenceValue } from '../models/Counter.js';
import { generateSecureQrToken } from '../utils/tokenGenerator.js';
import { generateQrDataUrl } from './qrService.js';
import { sendTicketEmail } from './emailService.js';
import { broadcastEvent } from '../socket.js';

export async function createNewRegistration(data) {
  // 1. Check if registrations are open
  const settings = await EventSetting.findOne();
  if (settings && (settings.isRegistrationOpen === false || settings.registrationOpen === false)) {
    const error = new Error('Registrations for Rankers Meet 2026 are currently closed.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check for duplicate registration by mobile or email
  const existing = await Registration.findOne({
    $or: [
      { email: data.email.toLowerCase() },
      { mobile: data.mobile },
      { mobileNumber: data.mobile },
    ],
  });

  if (existing) {
    const qrDataUrl = await generateQrDataUrl(existing.qrToken);
    return {
      alreadyRegistered: true,
      message: 'You are already registered for Rankers Meet 2026!',
      registration: existing,
      qrCode: qrDataUrl,
    };
  }

  // 3. Atomically generate unique sequential registration ID (e.g. RM1001)
  const seq = await getNextSequenceValue('registrationId');
  const registrationId = `RM${seq}`;

  // 4. Generate cryptographically secure random QR token (32-byte hex)
  const qrToken = generateSecureQrToken();

  // 5. Save registration record
  const registration = await Registration.create({
    ...data,
    academicYear: data.academicYear || '2025-2026',
    registrationId,
    qrToken,
    email: data.email.toLowerCase(),
    checkedIn: false,
    status: 'REGISTERED',
  });

  // 6. Generate QR data URL
  const qrDataUrl = await generateQrDataUrl(qrToken);

  // 7. Non-blocking ticket confirmation email
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const ticketUrl = `${clientUrl}/rankers-meet/success/${registration.registrationId}`;

  sendTicketEmail({
    to: registration.email,
    studentName: registration.studentName,
    registrationId: registration.registrationId,
    academicYear: registration.academicYear || '2025-2026',
    exam: registration.exam,
    rank: registration.rank,
    numberOfGuests: registration.numberOfGuests || registration.guestCount,
    ticketUrl,
    qrDataUrl,
  }).catch((err) => console.error('[EmailService Error]', err));

  // 8. Real-time broadcast
  broadcastEvent('registration:new', {
    registrationId: registration.registrationId,
    studentName: registration.studentName,
    academicYear: registration.academicYear || '2025-2026',
    exam: registration.exam,
    createdAt: registration.createdAt,
  });

  return {
    alreadyRegistered: false,
    message: 'Registration successful!',
    registration,
    qrCode: qrDataUrl,
  };
}

export async function queryRegistrations({
  page = 1,
  limit = 20,
  search = '',
  status = 'all',
  exam = 'all',
  classCourse = 'all',
  academicYear = 'all',
  emailStatus = 'all',
  checkedIn,
}) {
  const query = {};

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { studentName: searchRegex },
      { registrationId: searchRegex },
      { mobile: searchRegex },
      { mobileNumber: searchRegex },
      { email: searchRegex },
      { schoolCollege: searchRegex },
    ];
  }

  // CheckedIn filter support (checkedIn=false or checkedIn=true)
  if (checkedIn !== undefined) {
    query.checkedIn = checkedIn === 'true' || checkedIn === true;
  } else if (status && status !== 'all') {
    query.status = status;
  }

  if (exam && exam !== 'all') {
    query.exam = exam;
  }

  if (classCourse && classCourse !== 'all') {
    query.classCourse = classCourse;
  }

  if (academicYear && academicYear !== 'all') {
    query.academicYear = academicYear;
  }

  if (emailStatus && emailStatus !== 'all') {
    query.emailStatus = emailStatus.toUpperCase();
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [registrations, total] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-qrToken'), // keep private internal qrToken hidden from general lists
    Registration.countDocuments(query),
  ]);

  return {
    registrations,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export async function findRegistrationById(id) {
  const registration = await Registration.findOne({
    $or: [
      { registrationId: id.toUpperCase() },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  });

  if (!registration) {
    const error = new Error('Registration not found.');
    error.statusCode = 404;
    throw error;
  }

  return registration;
}

export async function resendEmailForRegistration(id) {
  const registration = await findRegistrationById(id);
  const qrDataUrl = await generateQrDataUrl(registration.qrToken);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const ticketUrl = `${clientUrl}/rankers-meet/success/${registration.registrationId}`;

  const result = await sendTicketEmail({
    to: registration.email,
    studentName: registration.studentName,
    registrationId: registration.registrationId,
    exam: registration.exam,
    rank: registration.rank,
    numberOfGuests: registration.numberOfGuests || registration.guestCount,
    ticketUrl,
    qrDataUrl,
  });

  return {
    registrationId: registration.registrationId,
    email: registration.email,
    emailStatus: result.emailStatus,
    success: result.success,
  };
}
