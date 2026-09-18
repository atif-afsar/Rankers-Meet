import {
  processCheckInService,
  getCheckInStatusService,
  revertCheckInService,
} from '../services/checkinService.js';

export async function processCheckIn(req, res, next) {
  try {
    const qrToken = req.body.token || req.body.qrToken;
    const registrationId = req.body.registrationId;
    const scannedBy = req.body.scannedBy || req.admin?.name || req.admin?.email || 'Gate Staff';
    const result = await processCheckInService({ qrToken, registrationId, scannedBy });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    if (err.statusType) {
      return res.status(err.statusCode || 400).json({
        success: false,
        status: err.statusType,
        message: err.message,
        details: err.details,
        attendee: err.attendee,
      });
    }
    next(err);
  }
}

export async function getCheckInStatus(req, res, next) {
  try {
    const { registrationId } = req.params;
    const data = await getCheckInStatusService(registrationId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function undoCheckIn(req, res, next) {
  try {
    const { registrationId } = req.params;
    const data = await revertCheckInService(registrationId);

    return res.status(200).json({
      success: true,
      message: `Check-in reverted for ${data.studentName} (${data.registrationId})`,
    });
  } catch (err) {
    next(err);
  }
}
