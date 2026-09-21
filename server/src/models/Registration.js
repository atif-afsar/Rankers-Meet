import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true,
    },
    parentName: {
      type: String,
      required: [true, 'Parent Name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      index: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    classCourse: {
      type: String,
      required: [true, 'Class/Course is required'],
      trim: true,
    },
    academicYear: {
      type: String,
      enum: ['2025-2026', '2026-2027'],
      default: '2025-2026',
      trim: true,
      index: true,
    },
    exam: {
      type: String,
      required: [true, 'Exam is required'],
      trim: true,
    },
    rank: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Rank is required'],
    },
    schoolCollege: {
      type: String,
      required: [true, 'School/College is required'],
      trim: true,
    },
    guestCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    numberOfGuests: {
      type: Number,
      default: 0,
      min: 0,
    },
    withParents: {
      type: String,
      default: 'With Parents',
      trim: true,
    },
    additionalInfo: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'CHECKED_IN', 'CANCELLED'],
      default: 'REGISTERED',
      index: true,
    },
    emailStatus: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedInBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'registrations',
  }
);

// Pre-save synchronization hook to ensure both naming conventions stay perfectly in sync
registrationSchema.pre('save', function (next) {
  if (this.mobile && !this.mobileNumber) {
    this.mobileNumber = this.mobile;
  } else if (this.mobileNumber && !this.mobile) {
    this.mobile = this.mobileNumber;
  }

  if (this.guestCount !== undefined && (this.numberOfGuests === undefined || this.numberOfGuests === 0)) {
    this.numberOfGuests = this.guestCount;
  } else if (this.numberOfGuests !== undefined && (this.guestCount === undefined || this.guestCount === 0)) {
    this.guestCount = this.numberOfGuests;
  }

  this.checkedIn = this.status === 'CHECKED_IN';

  next();
});

// Explicit compound & search indexes matching 04-DATABASE-SCHEMA.md
registrationSchema.index({ createdAt: -1 });
registrationSchema.index({
  studentName: 'text',
  registrationId: 'text',
  mobile: 'text',
  mobileNumber: 'text',
  email: 'text',
});

export const Registration = mongoose.model('Registration', registrationSchema);
