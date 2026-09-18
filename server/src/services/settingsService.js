import { EventSetting } from '../models/EventSetting.js';
import { broadcastEvent } from '../socket.js';

export async function fetchEventSettings() {
  let settings = await EventSetting.findOne();
  if (!settings) {
    settings = await EventSetting.create({});
  }
  return settings;
}

export async function updateEventSettings(newSettings) {
  let settings = await EventSetting.findOne();
  if (!settings) {
    settings = new EventSetting(newSettings);
  } else {
    // Explicitly sync boolean and string aliases so neither retains a stale state
    if (newSettings.isRegistrationOpen !== undefined) {
      newSettings.registrationOpen = Boolean(newSettings.isRegistrationOpen);
    } else if (newSettings.registrationOpen !== undefined) {
      newSettings.isRegistrationOpen = Boolean(newSettings.registrationOpen);
    }

    if (newSettings.eventDate !== undefined) {
      newSettings.date = newSettings.eventDate;
    } else if (newSettings.date !== undefined) {
      newSettings.eventDate = newSettings.date;
    }

    if (newSettings.eventTime !== undefined) {
      newSettings.time = newSettings.eventTime;
    } else if (newSettings.time !== undefined) {
      newSettings.eventTime = newSettings.time;
    }

    if (newSettings.maxCapacity !== undefined) {
      newSettings.maxRegistrations = newSettings.maxCapacity;
    } else if (newSettings.maxRegistrations !== undefined) {
      newSettings.maxCapacity = newSettings.maxRegistrations;
    }

    Object.assign(settings, newSettings);
  }

  await settings.save();
  broadcastEvent('settings:update', settings);
  return settings;
}
