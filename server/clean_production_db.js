import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Registration } from './src/models/Registration.js';
import { Checkin } from './src/models/Checkin.js';
import { Counter } from './src/models/Counter.js';
import { runSeed } from './src/utils/seed.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rankers_meet';

async function cleanProductionDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[CleanDB] Connected to MongoDB Atlas at', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

    // Purge dummy attendees and checkin records
    const deletedRegs = await Registration.deleteMany({});
    console.log(`[CleanDB] Purged ${deletedRegs.deletedCount} dummy registration records.`);

    const deletedCheckins = await Checkin.deleteMany({});
    console.log(`[CleanDB] Purged ${deletedCheckins.deletedCount} dummy check-in log records.`);

    // Reset sequence counter to 1000 so the first real attendee is RM1001
    await Counter.findByIdAndUpdate(
      'registrationId',
      { seq: 1000 },
      { upsert: true, new: true }
    );
    console.log('[CleanDB] Reset registration ID counter back to 1000 (next will be RM1001).');

    // Run seed to ensure Admin, Staff & Oct 3 event settings are updated
    await runSeed();

    const finalRegCount = await Registration.countDocuments();
    const finalCheckinCount = await Checkin.countDocuments();
    console.log(`\n[CleanDB] Verification complete:`);
    console.log(`- Registrations in DB: ${finalRegCount}`);
    console.log(`- Check-ins in DB: ${finalCheckinCount}`);
    console.log(`- Database is 100% clean and production ready!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[CleanDB Error]', err);
    process.exit(1);
  }
}

cleanProductionDb();
