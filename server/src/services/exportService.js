import { AsyncParser } from 'json2csv';
import * as XLSX from 'xlsx';
import { Registration } from '../models/Registration.js';
import { Checkin } from '../models/Checkin.js';

/**
 * Builds standard MongoDB filter object from query parameters
 */
export function buildRegistrationQuery(filters = {}) {
  const query = {};

  if (filters.search) {
    const term = filters.search.trim();
    query.$or = [
      { studentName: { $regex: term, $options: 'i' } },
      { registrationId: { $regex: term, $options: 'i' } },
      { mobile: { $regex: term, $options: 'i' } },
      { mobileNumber: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { schoolCollege: { $regex: term, $options: 'i' } },
    ];
  }

  // Check-in status filter
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'CHECKED_IN') {
      query.checkedIn = true;
    } else if (filters.status === 'REGISTERED' || filters.status === 'PENDING') {
      query.checkedIn = false;
    } else {
      query.status = filters.status;
    }
  }

  // Exam filter
  if (filters.exam && filters.exam !== 'all') {
    query.exam = filters.exam;
  }

  // Class / Course filter
  if (filters.classCourse && filters.classCourse !== 'all') {
    query.classCourse = filters.classCourse;
  }

  // Academic Year filter
  if (filters.academicYear && filters.academicYear !== 'all') {
    query.academicYear = filters.academicYear;
  }

  // Email delivery status filter
  if (filters.emailStatus && filters.emailStatus !== 'all') {
    query.emailStatus = filters.emailStatus;
  }

  // Date filter (Single date or date range)
  if (filters.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  } else if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      query.createdAt.$gte = start;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  return query;
}

/**
 * Extracts and maps rows matching the canonical fields including Academic Year
 */
export async function getFormattedRegistrationRows(filters = {}) {
  const query = buildRegistrationQuery(filters);
  const registrations = await Registration.find(query).sort({ createdAt: 1 }).lean();

  return registrations.map((r) => ({
    'Registration ID': r.registrationId,
    'Student Name': r.studentName,
    'Parent Name': r.parentName || 'N/A',
    'Mobile': r.mobileNumber || r.mobile || 'N/A',
    'Email': r.email,
    'Class/Course': r.classCourse,
    'Academic Year': r.academicYear || '2025-2026',
    'Exam': r.exam,
    'Rank': r.rank,
    'School/College': r.schoolCollege,
    'Guest Count': r.numberOfGuests ?? r.guestCount ?? 0,
    'Status': r.status,
    'Checked In': r.checkedIn || r.status === 'CHECKED_IN' ? 'Yes' : 'No',
    'Checked In At': r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : 'N/A',
    'Created At': r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A',
  }));
}

/**
 * Generate CSV representation of registrations
 */
export async function generateRegistrationsCsv(filters = {}) {
  const rows = await getFormattedRegistrationRows(filters);
  const parser = new AsyncParser();
  return await parser.parse(rows).promise();
}

/**
 * Generate Excel (.xlsx) buffer representation of registrations
 */
export async function generateRegistrationsXlsx(filters = {}) {
  const rows = await getFormattedRegistrationRows(filters);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 14),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Extracts check-in history rows matching 13-REPORTING-EXPORT.md
 */
export async function getFormattedCheckinHistoryRows() {
  const logs = await Checkin.find().sort({ createdAt: -1 }).lean();

  return logs.map((log) => ({
    'Registration ID': log.registrationId || 'N/A',
    'Student': log.studentName || 'Unknown Attendee',
    'Check-in time': log.checkedInAt
      ? new Date(log.checkedInAt).toLocaleString()
      : (log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'),
    'Staff': log.checkedInBy || 'Gate Staff',
    'Device': log.deviceInfo || 'Camera Scanner',
    'Status': log.status || 'SUCCESS',
  }));
}

/**
 * Generate CSV representation of check-in history
 */
export async function generateCheckinHistoryCsv() {
  const rows = await getFormattedCheckinHistoryRows();
  const parser = new AsyncParser();
  return await parser.parse(rows).promise();
}

/**
 * Generate Excel (.xlsx) representation of check-in history
 */
export async function generateCheckinHistoryXlsx() {
  const rows = await getFormattedCheckinHistoryRows();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 14),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Check-in History');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generates Attendance Report Summary required by 13-REPORTING-EXPORT.md
 */
export async function getAttendanceReportSummary() {
  const totalRegistered = await Registration.countDocuments();
  const totalCheckedIn = await Registration.countDocuments({
    $or: [{ checkedIn: true }, { status: 'CHECKED_IN' }],
  });
  const totalPending = Math.max(0, totalRegistered - totalCheckedIn);

  const guestAggregation = await Registration.aggregate([
    {
      $group: {
        _id: null,
        totalGuests: {
          $sum: { $ifNull: ['$numberOfGuests', { $ifNull: ['$guestCount', 0] }] },
        },
      },
    },
  ]);
  const totalGuests = guestAggregation[0]?.totalGuests || 0;

  const checkinPercentage = totalRegistered > 0
    ? `${((totalCheckedIn / totalRegistered) * 100).toFixed(1)}%`
    : '0.0%';

  return {
    totalRegistered,
    totalCheckedIn,
    totalPending,
    totalGuests,
    checkinPercentage,
    generatedAt: new Date(),
  };
}
