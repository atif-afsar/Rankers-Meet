import {
  generateRegistrationsCsv,
  generateRegistrationsXlsx,
  generateCheckinHistoryCsv,
  generateCheckinHistoryXlsx,
  getAttendanceReportSummary,
} from '../services/exportService.js';

/**
 * GET /api/export/registrations
 * Query params: format=csv|xlsx, status, exam, classCourse, emailStatus, search, date
 */
export async function exportRegistrations(req, res, next) {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const dateStamp = new Date().toISOString().slice(0, 10);

    if (format === 'xlsx' || format === 'excel') {
      const buffer = await generateRegistrationsXlsx(req.query);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="rankers_meet_2026_attendees_${dateStamp}.xlsx"`
      );
      return res.send(buffer);
    }

    const csv = await generateRegistrationsCsv(req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="rankers_meet_2026_attendees_${dateStamp}.csv"`
    );
    return res.send(csv);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/export/checkin-history
 * Query params: format=csv|xlsx
 */
export async function exportCheckinHistory(req, res, next) {
  try {
    const format = (req.query.format || 'csv').toLowerCase();
    const dateStamp = new Date().toISOString().slice(0, 10);

    if (format === 'xlsx' || format === 'excel') {
      const buffer = await generateCheckinHistoryXlsx();
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="rankers_meet_2026_checkin_history_${dateStamp}.xlsx"`
      );
      return res.send(buffer);
    }

    const csv = await generateCheckinHistoryCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="rankers_meet_2026_checkin_history_${dateStamp}.csv"`
    );
    return res.send(csv);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/export/attendance-report
 */
export async function getAttendanceReport(req, res, next) {
  try {
    const report = await getAttendanceReportSummary();
    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
}
