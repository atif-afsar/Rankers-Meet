# MongoDB Database Schema

Use MongoDB + Mongoose.

Collections:

1. registrations
2. admins
3. checkins
4. eventSettings

---

# Registration Model

Fields:

registrationId
studentName
parentName
mobile
email
classCourse
exam
rank
schoolCollege
guestCount

qrToken
status

checkedIn
checkedInAt
checkedInBy

createdAt
updatedAt

---

# Example

{
  registrationId: "RM1024",

  studentName: "Ahmed Khan",

  parentName: "Mohammad Khan",

  mobile: "XXXXXXXXXX",

  email: "student@example.com",

  classCourse: "12th",

  exam: "NEET",

  rank: 245,

  schoolCollege: "ABC School",

  guestCount: 2,

  qrToken: "secure-random-token",

  status: "REGISTERED",

  checkedIn: false,

  checkedInAt: null,

  checkedInBy: null
}

---

# Registration ID

Use a safe unique generation strategy.

Never rely only on document _id for the visible registration ID.

---

# QR Token

Generate cryptographically secure random tokens.

QR token must not expose:

- Mobile
- Email
- Parent name
- Other sensitive information

---

# Admin

Fields:

name
email
passwordHash
role
createdAt
updatedAt

Roles:

ADMIN
STAFF

---

# Checkin

Fields:

registration
registrationId
checkedInAt
checkedInBy
deviceInfo
createdAt

Store check-in history.

---

# Event Settings

Fields:

eventName
date
time
venue
description
registrationOpen
registrationClose
maxRegistrations

Allow admin to update event information.

---

# Indexes

Create indexes for:

registrationId
email
mobile
qrToken
checkedIn
createdAt

QR token must be unique.
Registration ID must be unique.