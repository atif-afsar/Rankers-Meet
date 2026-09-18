import mongoose from 'mongoose';

const eventSettingSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'Rankers Meet 2026',
    },
    date: {
      type: String,
      default: 'Sunday, October 4, 2026',
    },
    time: {
      type: String,
      default: '10:00 AM - 02:00 PM IST',
    },
    venue: {
      type: String,
      default: 'Royal Fort, Aligarh',
    },
    description: {
      type: String,
      default: 'Celebrating Achievers, CA Foundation, CUET & Entrance Rankers of Yasir Ali Classes',
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationClose: {
      type: String,
      default: 'Saturday, October 3, 2026, 11:59 PM IST',
    },
    maxRegistrations: {
      type: Number,
      default: 1200,
    },

    // Extended event presentation fields
    tagline: {
      type: String,
      default: 'Honoring The Champions of Yasir Ali Classes',
    },
    organization: {
      type: String,
      default: 'Yasir Ali Classes',
    },
    eventDate: {
      type: String,
      default: 'Sunday, October 4, 2026',
    },
    eventTime: {
      type: String,
      default: '10:00 AM - 02:00 PM IST',
    },
    address: {
      type: String,
      default: 'Royal Fort, Near Exhibition Ground, GT Road, Aligarh, UP 202001',
    },
    mapUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Royal+Fort+Aligarh',
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    maxCapacity: {
      type: Number,
      default: 1200,
    },
    announcement: {
      type: String,
      default: 'Welcome to Rankers Meet 2026! Bring your digital QR ticket for swift entrance.',
    },
    contactPhone: {
      type: String,
      default: '+91 88997 76655',
    },
    contactEmail: {
      type: String,
      default: 'admissions@yasiraliclasses.in',
    },
  },
  {
    timestamps: true,
    collection: 'eventSettings',
  }
);

// Pre-save synchronization hook to keep both field naming conventions aligned
eventSettingSchema.pre('save', function (next) {
  if (this.isModified('isRegistrationOpen')) {
    this.registrationOpen = this.isRegistrationOpen;
  } else if (this.isModified('registrationOpen')) {
    this.isRegistrationOpen = this.registrationOpen;
  }

  if (this.isModified('eventDate')) {
    this.date = this.eventDate;
  } else if (this.isModified('date')) {
    this.eventDate = this.date;
  }

  if (this.isModified('eventTime')) {
    this.time = this.eventTime;
  } else if (this.isModified('time')) {
    this.eventTime = this.time;
  }

  if (this.isModified('maxCapacity')) {
    this.maxRegistrations = this.maxCapacity;
  } else if (this.isModified('maxRegistrations')) {
    this.maxCapacity = this.maxRegistrations;
  }

  if (this.description && !this.tagline) this.tagline = this.description;

  next();
});

export const EventSetting = mongoose.model('EventSetting', eventSettingSchema);
export const EventSettings = EventSetting;
