# Testing & Production Deployment

Do not deploy before completing the following tests.

---

# Registration Tests

Test:

[ ] Valid registration

[ ] Missing student name

[ ] Invalid email

[ ] Invalid mobile

[ ] Invalid guest count

[ ] Duplicate registration

[ ] Double submit

[ ] Network failure

[ ] Database failure

---

# QR Tests

Test:

[ ] QR generation

[ ] QR download

[ ] QR scanning

[ ] Invalid QR

[ ] Modified QR

[ ] Duplicate QR

[ ] Same QR scanned by two devices

---

# Check-in Tests

Test:

[ ] Valid check-in

[ ] Already checked in

[ ] Invalid token

[ ] Camera permission denied

[ ] Camera unavailable

[ ] Multiple devices

[ ] Slow network

---

# Admin Tests

[ ] Login

[ ] Invalid login

[ ] Logout

[ ] Protected route

[ ] Registration search

[ ] Filters

[ ] Dashboard

[ ] Export

[ ] Staff permissions

---

# Security

Verify:

[ ] .env not committed

[ ] JWT secret protected

[ ] MongoDB credentials protected

[ ] Resend API key protected

[ ] CORS configured

[ ] Rate limiting enabled

[ ] Helmet enabled

[ ] Input validation enabled

[ ] Admin routes protected

[ ] QR token is secure

---

# Production

Frontend:

Deploy to Vercel/Netlify.

Backend:

Deploy to Vercel or another Node-compatible platform.

Database:

MongoDB Atlas.

Email:

Resend.

---

# Environment Variables

Backend:

MONGODB_URI=
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
CLIENT_URL=

Frontend:

VITE_API_URL=

---

# Domain

Connect:

yasiraliclasses.in

Landing page:

https://yasiraliclasses.in/rankers-meet

Admin:

https://yasiraliclasses.in/admin

---

# Final Event Simulation

Before the real event:

Create at least 50 dummy registrations.

Use multiple phones.

Test:

Registration
↓
Email
↓
QR
↓
Scanner
↓
Check-in
↓
Duplicate scan
↓
Dashboard
↓
Export

Simulate multiple staff members scanning simultaneously.

Do not launch the production event system until this complete flow works.