import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Registration } from './src/models/Registration.js';
import { Admin } from './src/models/Admin.js';
import { Checkin } from './src/models/Checkin.js';
import { EventSetting } from './src/models/EventSetting.js';

dotenv.config();

async function checkIndexes() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rankers_meet');
  console.log('[DB] Connected to MongoDB.');

  console.log('[DB] Syncing Registration indexes...');
  await Registration.syncIndexes();

  const indexes = await Registration.collection.getIndexes();
  console.log('\n--- VERIFIED REGISTRATION INDEXES ---');
  for (const [name, def] of Object.entries(indexes)) {
    console.log(`Index "${name}":`, JSON.stringify(def));
  }

  console.log('\n--- VERIFIED COLLECTIONS ---');
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const c of collections) {
    console.log(`- Collection: ${c.name}`);
  }

  await mongoose.disconnect();
  console.log('\n[DB] Disconnected.');
}

checkIndexes().catch(console.error);
