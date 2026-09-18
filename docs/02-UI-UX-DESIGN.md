# Rankers Meet 2026 — UI/UX Specification

## Design Direction

Create a premium education-event experience.

Brand:
Yasir Ali Classes

The design should feel:

- Premium
- Energetic
- Youth-focused
- Modern
- Trustworthy
- Event-oriented

Avoid generic AI-looking designs.

Avoid excessive gradients.

Avoid unnecessary glassmorphism.

---

# Public Pages

## 1. Landing Page

Route:

/rankers-meet

Sections:

1. Navbar
2. Hero
3. Event information
4. About Rankers Meet
5. Who can attend
6. Event highlights
7. Previous event/gallery
8. Registration CTA
9. FAQ
10. Venue/location
11. Footer

---

# Hero

Include:

Rankers Meet 2026

A premium headline.

Event date.

Venue.

Primary CTA:

Register Now

Secondary CTA:

View Details

Include event visual/branding.

---

# Registration

Route:

/rankers-meet/register

Use a clean multi-section form.

Show:

Progress indicator

Step 1:
Personal Details

Step 2:
Academic Details

Step 3:
Guest Details

Step 4:
Confirmation

---

# Success Page

Route:

/rankers-meet/success

Show:

Registration Successful

Registration ID

Student name

QR ticket

Download Ticket

Ticket email confirmation

---

# Admin

Admin should have a completely separate dashboard layout.

Routes:

/admin/login
/admin
/admin/registrations
/admin/check-in
/admin/settings

Dashboard must work particularly well on tablets and mobile devices because staff may use phones at the entrance.

---

# QR Scanner UI

Prioritize:

Large camera area

Clear scan status

Large success/error state

Example:

GREEN:
VALID
CHECK-IN SUCCESSFUL

RED:
ALREADY CHECKED IN

RED:
INVALID TICKET

Avoid tiny buttons.

---

# Responsive Design

Mobile:
320px+

Tablet:
768px+

Desktop:
1024px+

The registration and check-in flows must be optimized for mobile first.

---

# Accessibility

Use:

- Proper labels
- Keyboard navigation
- Focus states
- Accessible buttons
- Color + text for status
- Good contrast
- Error messages