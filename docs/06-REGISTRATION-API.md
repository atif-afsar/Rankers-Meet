# Registration API

Build complete student registration functionality.

## POST /api/registrations

Request:

{
  studentName,
  parentName,
  mobile,
  email,
  classCourse,
  exam,
  rank,
  schoolCollege,
  guestCount
}

---

# Validation

Validate:

studentName:
required

parentName:
required

mobile:
valid Indian mobile format

email:
valid email

classCourse:
required

exam:
required

rank:
optional or numeric depending on event rules

schoolCollege:
required

guestCount:
integer >= 0

---

# Duplicate Protection

Prevent accidental duplicate registrations.

Use appropriate duplicate checks.

Do not blindly reject legitimate registrations only because the same parent or school appears multiple times.

Consider mobile/email combination.

---

# Registration Creation

Process:

1. Validate request.
2. Check duplicate.
3. Generate registration ID.
4. Generate secure QR token.
5. Save registration.
6. Generate QR.
7. Trigger ticket email.
8. Return registration result.

---

# Response

{
  success: true,
  data: {
    registrationId,
    studentName,
    status
  }
}

Do not return private internal fields unnecessarily.

---

# Admin Registration APIs

GET /api/registrations

Support:

?page=1
&limit=20
&search=Ahmed
&classCourse=12th
&exam=NEET
&checkedIn=false

GET /api/registrations/:id

Allow admin to view complete registration.

---

# Important

Registration ID must never be reused.

Registration creation must be safe against duplicate simultaneous requests.