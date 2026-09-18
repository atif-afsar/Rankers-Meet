# QR Check-in System

This is one of the most important modules.

Route:

/admin/check-in

---

# Scanner

Use device camera.

Request camera permission.

Show scanning area.

---

# Scan Flow

Staff scans QR.

Frontend extracts token.

Send:

POST /api/checkin

Request:

{
  token: "secure-token"
}

---

# Backend Validation

Check:

1. Token exists.
2. Registration exists.
3. Registration status is valid.
4. Ticket has not already been checked in.

---

# Successful Check-in

Update:

checkedIn = true

checkedInAt = current timestamp

checkedInBy = current admin/staff

Create check-in history.

Return:

{
  success: true,
  status: "CHECKED_IN"
}

---

# UI

Show:

🟢 VALID

CHECK-IN SUCCESSFUL

Student Name

Registration ID

---

# Duplicate

If already checked in:

🔴 ALREADY CHECKED IN

Student Name

Registration ID

Checked in at:

10:42 AM

---

# Invalid

If token does not exist:

🔴 INVALID TICKET

---

# Race Condition Protection

Two staff devices could scan the same ticket at almost exactly the same time.

Backend must prevent duplicate check-in.

Use an atomic database update where possible.

Only the first successful request should mark the attendee checked in.

---

# Scanner UX

After successful scan:

Pause scanner briefly.

Show result.

Allow:

Scan Next

The scanner should then resume.

---

# Camera Errors

Handle:

Permission denied
No camera
Camera unavailable
Unsupported browser

Show useful instructions.

---

# Security

Never trust frontend check-in status.

Backend must always validate.