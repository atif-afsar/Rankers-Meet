# Email Ticket Delivery

Use Resend.

## Email

After registration, send confirmation email.

Subject:

Rankers Meet 2026 — Registration Confirmed

---

# Email Content

Hello {{studentName}},

Your registration for Rankers Meet 2026 has been successfully completed.

Registration ID:
{{registrationId}}

Please keep your QR ticket ready for entry.

Include:

QR Code

Event details

Venue

Date

Time

---

# Requirements

Use HTML email.

Make email responsive.

Use Yasir Ali Classes branding.

---

# Failure Handling

Email failure must NOT invalidate the registration.

Registration remains successful.

Store email delivery status:

emailStatus:
PENDING
SENT
FAILED

Admin should be able to identify failed emails.

---

# Security

Never expose Resend API key to frontend.