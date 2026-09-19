import * as z from 'zod';

export const COURSE_EXAM_OPTIONS = [
  '6th Entrance',
  '11th Entrance (Science / Commerce / Diploma)',
  'B.Com / BBA',
  'BA / BA Foreign Languages / BALLB',
  'MBA',
  'Other Course / Entrance',
];

export const ACADEMIC_YEAR_OPTIONS = [
  '2025-2026',
  '2026-2027',
];

export const registrationFormSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(1, 'Student name is required.')
    .min(2, 'Student name must be at least 2 characters.'),
  parentName: z
    .string()
    .trim()
    .min(1, 'Parent name is required.')
    .min(2, 'Parent name must be at least 2 characters.'),
  mobileNumber: z
    .string()
    .trim()
    .min(1, 'Mobile number is required.')
    .regex(/^[6-9]\d{9}$/, 'Mobile number is invalid. Please enter a valid 10-digit Indian mobile number.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Email address is invalid.'),
  classCourse: z
    .string()
    .trim()
    .min(1, 'Course / Entrance Exam is required.'),
  academicYear: z
    .enum(['2025-2026', '2026-2027'], {
      errorMap: () => ({ message: 'Please select your academic / batch year.' }),
    })
    .default('2025-2026'),
  exam: z
    .string()
    .optional()
    .default(''),
  rank: z
    .string()
    .trim()
    .min(1, 'Rank or Selection Status is required.'),
  schoolCollege: z
    .string()
    .trim()
    .min(1, 'School/College is required.'),
  numberOfGuests: z.coerce
    .number({ invalid_type_error: 'Please select parent accompaniment.' })
    .min(0, 'Cannot be negative.')
    .max(1, 'Maximum 1 accompanying parent allowed (Mother or Father).'),
  additionalInfo: z.string().optional().default(''),
});
