# Registration Frontend

Build:

/rankers-meet/register

Use:

React Hook Form
Zod
Axios

---

# Form

Sections:

Personal Details:

- Student Name
- Parent Name
- Mobile
- Email

Academic:

- Class/Course
- Exam
- Rank
- School/College

Guests:

- Number of Guests

---

# UX

Show inline validation.

Example:

Mobile number is required.

Email address is invalid.

Do not wait until final submission to show every error.

---

# Submit

Button:

Complete Registration

During request:

Disable button.

Show:

Processing Registration...

Prevent double submission.

---

# Success

Redirect to:

/rankers-meet/success/:registrationId

Show:

Registration Successful

Registration ID

Student Name

Email confirmation status

Download Ticket

---

# Error Handling

If API fails:

Show friendly message.

Do not expose backend errors or stack traces.

Allow retry.

---

# Loading States

Implement:

- Initial loading
- Submit loading
- Success
- Error

---

# Mobile

Form must be extremely easy to use on mobile devices.