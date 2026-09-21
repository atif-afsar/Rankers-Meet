import { z } from 'zod';
import {
  createNewRegistration,
  queryRegistrations,
  findRegistrationById,
} from '../services/registrationService.js';

// Flexible schema matching 06-REGISTRATION-API.md
const registrationSchema = z.object({
  studentName: z.string().min(2, 'studentName is required (minimum 2 characters)'),
  parentName: z.string().min(2, 'parentName is required'),
  mobile: z
    .string()
    .optional()
    .refine((val) => !val || /^(?:\+91|91|0)?[6-9]\d{9}$/.test(val.replace(/\s+/g, '')), {
      message: 'mobile must be a valid Indian mobile number',
    }),
  mobileNumber: z.string().optional(),
  email: z.string().email('email must be a valid email address'),
  classCourse: z.string().min(1, 'classCourse is required'),
  academicYear: z.enum(['2025-2026', '2026-2027']).optional().default('2025-2026'),
  exam: z.string().optional(),
  rank: z.union([z.string(), z.number()]).optional().default('Selected'),
  schoolCollege: z.string().min(2, 'schoolCollege is required'),
  guestCount: z.coerce.number().int().min(0).max(2).optional(),
  numberOfGuests: z.coerce.number().int().min(0).max(2).optional(),
  additionalInfo: z.string().optional().default(''),
}).refine((data) => data.mobile || data.mobileNumber, {
  message: 'mobile number is required',
  path: ['mobile'],
});

export async function createRegistration(req, res, next) {
  try {
    const parseResult = registrationSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMsg,
      });
    }

    const payload = parseResult.data;
    const normalizedMobile = (payload.mobile || payload.mobileNumber).replace(/\s+/g, '');
    const normalizedGuests = payload.guestCount !== undefined ? payload.guestCount : (payload.numberOfGuests || 0);

    const registrationData = {
      ...payload,
      academicYear: payload.academicYear || '2025-2026',
      mobile: normalizedMobile,
      mobileNumber: normalizedMobile,
      guestCount: normalizedGuests,
      numberOfGuests: normalizedGuests,
      exam: payload.exam || payload.classCourse,
      rank: String(payload.rank || 'Selected'),
    };

    const result = await createNewRegistration(registrationData);
    const statusCode = result.alreadyRegistered ? 200 : 201;

    // Response matching 06-REGISTRATION-API.md lines 83-95
    return res.status(statusCode).json({
      success: true,
      data: {
        registrationId: result.registration.registrationId,
        studentName: result.registration.studentName,
        status: result.registration.status,
      },
      qrCode: result.qrCode,
      registration: result.registration, // backwards-compatible for UI navigation state
    });
  } catch (err) {
    next(err);
  }
}

export async function getRegistrations(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = 'all',
      exam = 'all',
      classCourse = 'all',
      academicYear = 'all',
      emailStatus = 'all',
      checkedIn,
    } = req.query;

    const result = await queryRegistrations({
      page,
      limit,
      search,
      status,
      exam,
      classCourse,
      academicYear,
      emailStatus,
      checkedIn,
    });

    return res.status(200).json({
      success: true,
      data: result.registrations,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
}

export async function getRegistrationById(req, res, next) {
  try {
    const { id } = req.params;
    const registration = await findRegistrationById(id);

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (err) {
    next(err);
  }
}

export async function resendEmail(req, res, next) {
  try {
    const { id } = req.params;
    const { resendEmailForRegistration } = await import('../services/registrationService.js');
    const result = await resendEmailForRegistration(id);

    return res.status(200).json({
      success: true,
      message: `Ticket confirmation email re-dispatched (${result.emailStatus})`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
