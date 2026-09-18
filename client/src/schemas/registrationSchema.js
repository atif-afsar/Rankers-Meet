import * as z from 'zod';

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
    .min(1, 'Class/Course is required.'),
  exam: z
    .string()
    .trim()
    .min(1, 'Exam is required.'),
  rank: z
    .string()
    .trim()
    .min(1, 'Rank is required.'),
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
