import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from '../models/Admin.js';
import { EventSetting } from '../models/EventSetting.js';
import { Registration } from '../models/Registration.js';
import { Counter } from '../models/Counter.js';
import { Checkin } from '../models/Checkin.js';
import { generateSecureQrToken } from './tokenGenerator.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rankers_meet';

export async function runSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB.');

    // 1. Seed Admins matching 04-DATABASE-SCHEMA.md
    const existingAdmin = await Admin.findOne({ email: 'admin@yasiraliclasses.in' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin@12345', 10);
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@yasiraliclasses.in',
        passwordHash,
        role: 'ADMIN',
      });
      console.log('[Seed] Created Super Admin (admin@yasiraliclasses.in / Admin@12345)');
    }

    // 2. Seed / Update Event Settings
    const eventData = {
      eventName: 'Rankers Meet 2026',
      date: 'Sunday, October 4, 2026',
      time: '10:00 AM - 02:00 PM IST',
      venue: 'Royal Fort, Aligarh',
      description: 'Celebrating Achievers, CA Foundation, CUET & Entrance Rankers of Yasir Ali Classes',
      registrationOpen: true,
      registrationClose: 'Saturday, October 3, 2026, 11:59 PM IST',
      maxRegistrations: 1200,

      // Compatibility fields
      tagline: 'Honoring The Champions of Yasir Ali Classes',
      organization: 'Yasir Ali Classes',
      eventDate: 'Sunday, October 4, 2026',
      eventTime: '10:00 AM - 02:00 PM IST',
      address: 'Royal Fort, Near Exhibition Ground, GT Road, Aligarh, UP 202001',
      mapUrl: 'https://maps.google.com/?q=Royal+Fort+Aligarh',
      isRegistrationOpen: true,
      maxCapacity: 1200,
      announcement: 'Welcome all rankers, qualifiers, and proud parents! Please bring your digital QR ticket for swift entrance.',
      contactPhone: '+91 90454 17079',
      contactEmail: 'admissions@yasiraliclasses.in',
    };

    const existingSettings = await EventSetting.findOne();
    if (!existingSettings) {
      await EventSetting.create(eventData);
      console.log('[Seed] Initialized Event Settings.');
    } else {
      await EventSetting.updateOne({}, { $set: eventData });
      console.log('[Seed] Updated Event Settings to October 3, 2026.');
    }

    // 3. Initialize Counter if not present
    const counter = await Counter.findById('registrationId');
    if (!counter) {
      await Counter.create({ _id: 'registrationId', seq: 1000 });
      console.log('[Seed] Initialized Registration ID counter at 1000.');
    }

    // Production ready: No dummy attendees inserted. Fresh database starts clean.
    console.log('[Seed] Database is clean and production-ready.');

    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed Error]', err);
  }
}

// Allow direct execution
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed().then(() => mongoose.disconnect());
}
