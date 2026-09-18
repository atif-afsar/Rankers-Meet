import {
  fetchEventSettings,
  updateEventSettings,
} from '../services/settingsService.js';

export async function getSettings(req, res, next) {
  try {
    const settings = await fetchEventSettings();
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await updateEventSettings(req.body);
    return res.status(200).json({
      success: true,
      message: 'Event settings updated successfully.',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}
