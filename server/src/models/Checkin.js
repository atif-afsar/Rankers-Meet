import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      default: null,
    },
    registrationId: {
      type: String,
      default: null,
      index: true,
    },
    qrToken: {
      type: String,
      default: null,
    },
    studentName: {
      type: String,
      default: 'Unknown Attendee',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'DUPLICATE', 'INVALID'],
      default: 'SUCCESS',
    },
    message: {
      type: String,
      default: 'Check-in processed',
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
    },
    checkedInBy: {
      type: String,
      default: 'Gate Staff',
    },
    deviceInfo: {
      type: String,
      default: 'Camera Scanner',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'checkins',
  }
);

export const Checkin = mongoose.model('Checkin', checkinSchema);
export const CheckInLog = Checkin;
