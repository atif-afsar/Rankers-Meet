# Rankers Meet 2026 — Project PRD

## 1. Project Overview

Build a complete digital registration and QR-based attendance system for Yasir Ali Classes' Rankers Meet 2026.

Website:
https://yasiraliclasses.in

Dedicated event page:
https://yasiraliclasses.in/rankers-meet

The system must allow students to:

1. Visit the Rankers Meet landing page.
2. View event information.
3. Register online.
4. Receive a unique registration ID.
5. Receive a QR-based digital ticket.
6. Present the QR code at the event entrance.
7. Get checked in through a mobile/tablet camera.

Admins must be able to:

1. View registrations.
2. Search and filter attendees.
3. View registration statistics.
4. Scan QR tickets.
5. Prevent duplicate check-ins.
6. View live attendance.
7. Export registration data.

---

# 2. Event

Event Name:
Rankers Meet 2026

Organization:
Yasir Ali Classes

Event URL:
https://yasiraliclasses.in/rankers-meet

The exact event date, time and venue should be configurable through admin/event settings rather than hardcoded throughout the application.

---

# 3. Public User Flow

Instagram / WhatsApp / Website
        ↓
Rankers Meet Landing Page
        ↓
Register Now
        ↓
Registration Form
        ↓
Submit
        ↓
Backend Validation
        ↓
Create Registration
        ↓
Generate Registration ID
        ↓
Generate Secure QR Token
        ↓
Generate Ticket
        ↓
Send Ticket Email
        ↓
Registration Complete

---

# 4. Registration Fields

Required:

- Student Name
- Parent Name
- Mobile Number
- Email
- Class/Course
- Exam
- Rank
- School/College

Optional:

- Number of Guests
- Additional information

The exact fields should be configurable where practical.

---

# 5. Registration ID

Every successful registration must receive a unique ID.

Example:

RM1001
RM1002
RM1003

The registration ID must be unique.

Do not use the registration ID itself as the QR security credential.

---

# 6. QR Ticket

Each registration receives:

- Student name
- Registration ID
- Event name
- Status
- QR code

Example:

RANKERS MEET 2026

Ahmed Khan

Registration ID:
RM1024

Status:
REGISTERED

[QR CODE]

The QR code must contain a secure random token.

Never place sensitive personal information directly inside the QR code.

---

# 7. Check-in

Staff can open the check-in page on:

- Android phone
- iPhone
- Tablet
- Laptop with camera

The browser requests camera access.

Staff scans QR.

Backend validates:

1. Token exists.
2. Registration exists.
3. Ticket is valid.
4. Ticket has not already been checked in.

Successful response:

VALID — CHECK-IN SUCCESSFUL

Duplicate response:

ALREADY CHECKED IN

Invalid response:

INVALID TICKET

---

# 8. Dashboard

Dashboard must display:

Registered:
850

Checked In:
637

Pending:
213

Additional metrics:

- Total registrations
- Today's registrations
- Checked-in percentage
- Guest count
- Registrations by class
- Registrations by exam
- Recent check-ins

---

# 9. Admin

Admin functionality:

- Login
- Logout
- Dashboard
- Registrations
- Registration details
- Search
- Filter
- QR check-in
- Manual check-in
- Check-in history
- Export CSV/Excel
- Event settings

---

# 10. Technology

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- Framer Motion

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

QR:

- QR generation library
- QR scanner library

Email:

- Resend

Real-time:

- Socket.IO

---

# 11. Important Requirements

The application must be:

- Mobile-first
- Responsive
- Fast
- Secure
- Easy to operate
- Easy for staff to understand
- Production ready

Do not over-engineer the system.

Build reusable components.

Use environment variables for all secrets.

Never expose:

- MongoDB credentials
- JWT secret
- Resend API key
- Admin credentials
- Private API keys

---

# 12. Development Rule

Build the project sequentially.

Do not skip phases.

Before starting a new phase:

1. Verify previous phase.
2. Run application.
3. Fix errors.
4. Test functionality.
5. Then continue.

Do not rewrite working functionality unnecessarily.