import { Registration } from '../models/Registration.js';
import { Checkin } from '../models/Checkin.js';
import { broadcastEvent } from '../socket.js';

export async function processCheckInService({ token, qrToken, registrationId, scannedBy = 'Gate Staff', deviceInfo = 'Camera Scanner' }) {
  const actualToken = (token || qrToken || '').trim();
  const actualId = (registrationId || '').trim();

  if (!actualToken && !actualId) {
    const error = new Error('INVALID TICKET - No QR token or Registration ID provided.');
    error.statusCode = 400;
    error.statusType = 'INVALID';
    throw error;
  }

  let registration = null;

  if (actualToken) {
    registration = await Registration.findOne({ qrToken: actualToken });
  } else if (actualId) {
    if (/^\d{10}$/.test(actualId)) {
      registration = await Registration.findOne({
        $or: [{ mobile: actualId }, { mobileNumber: actualId }],
      });
    } else {
      registration = await Registration.findOne({
        registrationId: actualId.toUpperCase(),
      });
    }
  }

  // 1. Invalid Ticket
  if (!registration) {
    await Checkin.create({
      registrationId: registrationId || null,
      qrToken: qrToken || null,
      studentName: 'Unknown',
      status: 'INVALID',
      message: 'INVALID TICKET - No matching record found.',
      checkedInBy: scannedBy,
      deviceInfo,
    });

    broadcastEvent('checkin:log', {
      status: 'INVALID',
      message: 'Invalid ticket scanned',
      time: new Date(),
    });

    const error = new Error('INVALID TICKET');
    error.statusCode = 404;
    error.statusType = 'INVALID';
    error.details = 'This QR ticket does not match any registered attendee.';
    throw error;
  }

  // 2. Duplicate Check-in (Atomic race-condition safe check)
  const now = new Date();
  const updatedRegistration = await Registration.findOneAndUpdate(
    { _id: registration._id, status: 'REGISTERED' },
    {
      $set: {
        status: 'CHECKED_IN',
        checkedIn: true,
        checkedInAt: now,
        checkedInBy: scannedBy,
      },
    },
    { new: true }
  );

  // If update was null, attendee was already checked in
  if (!updatedRegistration) {
    await Checkin.create({
      registration: registration._id,
      registrationId: registration.registrationId,
      qrToken: registration.qrToken,
      studentName: registration.studentName,
      status: 'DUPLICATE',
      message: `Duplicate check-in attempt for ${registration.studentName} (${registration.registrationId})`,
      checkedInAt: now,
      checkedInBy: scannedBy,
      deviceInfo,
    });

    broadcastEvent('checkin:log', {
      status: 'DUPLICATE',
      studentName: registration.studentName,
      registrationId: registration.registrationId,
      message: 'Already checked in',
      time: new Date(),
    });

    const error = new Error('ALREADY CHECKED IN');
    error.statusCode = 409;
    error.statusType = 'DUPLICATE';
    error.details = `${registration.studentName} was already checked in at ${new Date(
      registration.checkedInAt
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    error.attendee = {
      registrationId: registration.registrationId,
      studentName: registration.studentName,
      academicYear: registration.academicYear || '2025-2026',
      exam: registration.exam,
      rank: registration.rank,
      classCourse: registration.classCourse,
      numberOfGuests: registration.numberOfGuests || registration.guestCount,
      checkedInAt: registration.checkedInAt,
      checkedIn: true,
    };
    throw error;
  }

  // 3. Valid Check-in Log & Broadcast
  await Checkin.create({
    registration: updatedRegistration._id,
    registrationId: updatedRegistration.registrationId,
    qrToken: updatedRegistration.qrToken,
    studentName: updatedRegistration.studentName,
    status: 'SUCCESS',
    message: `Checked in successfully: ${updatedRegistration.studentName}`,
    checkedInAt: now,
    checkedInBy: scannedBy,
    deviceInfo,
  });

  const checkInPayload = {
    registrationId: updatedRegistration.registrationId,
    studentName: updatedRegistration.studentName,
    academicYear: updatedRegistration.academicYear || '2025-2026',
    exam: updatedRegistration.exam,
    rank: updatedRegistration.rank,
    classCourse: updatedRegistration.classCourse,
    numberOfGuests: updatedRegistration.numberOfGuests || updatedRegistration.guestCount,
    guestCount: updatedRegistration.guestCount || updatedRegistration.numberOfGuests,
    checkedIn: true,
    checkedInAt: now,
    checkedInBy: scannedBy,
  };

  broadcastEvent('checkin:success', checkInPayload);

  return {
    success: true,
    status: 'CHECKED_IN',
    message: 'VALID — CHECK-IN SUCCESSFUL',
    attendee: checkInPayload,
  };
}

export async function getCheckInStatusService(registrationId) {
  const registration = await Registration.findOne({
    registrationId: registrationId.trim().toUpperCase(),
  });

  if (!registration) {
    const error = new Error('Registration not found.');
    error.statusCode = 404;
    throw error;
  }

  const logs = await Checkin.find({
    registrationId: registration.registrationId,
  }).sort({ createdAt: -1 });

  return {
    registrationId: registration.registrationId,
    studentName: registration.studentName,
    status: registration.status,
    checkedIn: registration.checkedIn || registration.status === 'CHECKED_IN',
    checkedInAt: registration.checkedInAt,
    checkedInBy: registration.checkedInBy,
    logs,
  };
}

export async function revertCheckInService(registrationId) {
  const registration = await Registration.findOne({
    registrationId: registrationId.trim().toUpperCase(),
  });

  if (!registration) {
    const error = new Error('Registration not found.');
    error.statusCode = 404;
    throw error;
  }

  registration.status = 'REGISTERED';
  registration.checkedIn = false;
  registration.checkedInAt = null;
  registration.checkedInBy = null;
  await registration.save();

  broadcastEvent('checkin:undone', {
    registrationId: registration.registrationId,
    studentName: registration.studentName,
  });

  return {
    registrationId: registration.registrationId,
    studentName: registration.studentName,
  };
}
